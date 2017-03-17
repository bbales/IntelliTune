// Initialize canvas
let ctx = document.getElementById("myCanvas").getContext("2d")
let canvasW = ctx.canvas.clientWidth
let canvasH = ctx.canvas.clientHeight

let a = new Analyzer()
a.initInputSource()
    .then(() => a.run())
    .then(() => plotFFT())

// Array of notes
let standard = [-29, -24, -19, -14, -10, -5].map(n => ({ freq: note(n), normal: a.normalizeFrequency(note(n)) }))
let maxs = [
    [],
    [],
    [],
    [],
    [],
    []
]

function note(n) {
    let a = Math.pow(2, 1 / 12)
    return 440 * Math.pow(a, n)
}

var stretch = 10

ctx.font = "10px Arial"

function plotFFT() {
    ctx.clearRect(0, 0, canvasW, canvasH)

    for (let ind = 0; ind < standard.length; ind++) {
        // Get window of interest
        let win = a._filtData.slice(standard[ind].normal - stretch, standard[ind].normal + stretch)

        // Get the max value, max index and average value
        let m = Math.max(...win)
        let mi = win.indexOf(m)
        let avg = win.reduce((a, f) => a += f, 0) / win.length

        maxs[ind] = maxs[ind].concat(mi).slice(-5)
        let consec = maxs[ind].every(f => f == maxs[ind][0])

        win.forEach((f, i) => {
            ctx.fillStyle = (consec && mi == i ? 'blue' : 'black')
            let h = canvasH * f / 256
            ctx.fillRect(i * canvasW / win.length, ind * canvasH / standard.length, canvasW / win.length, canvasH / standard.length)
        })
    }

    window.requestAnimationFrame(plotFFT)
}
