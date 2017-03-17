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

var stretch = 10

ctx.font = "10px Arial"

function plotFFT() {
    ctx.clearRect(0, 0, canvasW, canvasH)

    for (let ind = 0; ind < standard.length; ind++) {
        let sl = a._filtData.slice(standard[ind].normal - stretch, standard[ind].normal + stretch)
        let m = Math.max(...sl)
        sl.forEach((f, i) => {
            ctx.fillStyle = (f == m ? 'blue' : 'black')
            let h = canvasH * f / 256
            // ctx.fillRect( canvasH - h, canvasW / (stretch*2+1), h)
            ctx.fillRect(i * canvasW / (stretch * 2 + 1), ind * canvasH / standard.length, canvasW / (stretch * 2 + 1), canvasH / standard.length)
        })
    }

    window.requestAnimationFrame(plotFFT)
}
