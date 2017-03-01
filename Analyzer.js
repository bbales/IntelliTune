class Analyzer {
    constructor() {
        // Create audio context and analyzer
        this._actx = new(window.AudioContext || window.webkitAudioContext)()

        // Update time in ms
        this._refreshRate = 60

        this.initFFT()

        // Reduce to the highest frequency of interest
        this._bandwidth = 200
        this._bandwidthNormal = Math.round(this.normalizeFrequency(this._bandwidth))

    }

    initInputSource() {
        // Set up microphone
        return navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => this._actx.createMediaStreamSource(stream).connect(this._analyser))
            .catch(e => console.log(e))
    }

    initFFT() {
        // Set up analyser for FFT
        this._analyser = this._actx.createAnalyser()
        this._analyser.fftSize = 32768

        // Initialize byte array for FFT data
        this._byteData = new Uint8Array(this._analyser.frequencyBinCount)
        this._filtData = []
    }

    denormalizeFrequency(bin) {
        return Math.round(this._actx.sampleRate * bin / this._analyser.frequencyBinCount / 2)
    }

    normalizeFrequency(freq) {
        return this._analyser.frequencyBinCount * freq / (this._actx.sampleRate / 2)
    }

    get frequencyPeaks() {
        if (!this._filtData) return []

        // Take the derivative of the data! Map that to a regular array too, no typed array nonsense
        let derivative = Array.prototype
            .map.bind(this._filtData)(f => parseInt(f))
            .map((f, i, a) => f - (i == 0 ? 0 : a[i - 1]))

        // Find sign changes
        let signChanges = derivative.map((f, i, a) => f * (i == 0 ? 0 : a[i - 1]) < 0)

        // OR signChanges array with dataArray
        return this._filtData.map((f, i) => signChanges[i] ? f : 0)
    }

    update() {
        // Stop running if running flag is cleared
        if (!this._running) return

        // Get FFT data
        this._analyser.getByteFrequencyData(this._byteData)

        // Find the average (noise floor)
        let avg = this._byteData.slice(0, this._bandwidthNormal).reduce((a, v) => a += v) / this._bandwidthNormal

        // To remove the basic avg filtering, just uncomment this line
        avg = 0

        // Reduce all components to lower the floor
        this._filtData = this._byteData.map(f => f > avg ? f - avg : 0).map(f => f * (1 + avg / 256))

        this._filtData = this.frequencyPeaks

        // Recursively update
        setTimeout(() => this.update(), this._refreshRate)
    }

    run() {
        this._running = true
        this.update()
    }

    stop() {
        this._running = false
    }
}
