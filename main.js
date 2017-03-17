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

function note(n) {
    let a = Math.pow(2, 1 / 12)
    return 440 * Math.pow(a, n)
}

var ind = 1

ctx.font = "10px Arial"

function plotFFT() {
    ctx.clearRect(0, 0, canvasW, canvasH)

    let sl = a._filtData.slice(standard[ind].normal - 10, standard[ind].normal + 10)

    let m = Math.max(...sl)
    console.log(m)

    sl.forEach((f, i) => {
        ctx.fillStyle = (f == m ? 'blue' : 'black')
        let h = canvasH * f / 256
        ctx.fillRect(i * canvasW / 21, canvasH - h, canvasW / 21, h)
    })

    // for (let i = 0; i < a._bandwidthNormal; i++) {
    //     let h = canvasH * a._filtData[i] / 256
    //     ctx.fillStyle = 'blue'
    //     ctx.fillRect(i * canvasW / a._bandwidthNormal, canvasH - h, canvasW / a._bandwidthNormal, h)
    //
    //     ctx.fillStyle = 'white'
    //     ctx.fillText(a.denormalizeFrequency(i), i * canvasW / a._bandwidthNormal, canvasH - 10)
    // }
    window.requestAnimationFrame(plotFFT)
}
