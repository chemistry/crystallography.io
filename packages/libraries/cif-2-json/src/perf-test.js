const parse = window['cif2json']['parse'];
const cifFile = window.CIF_2222708;

function logExecutionTime() {
    console.time('parse');
    // norm - 500 ms; - to 38ms
    //
    for (var i = 0; i < 10; i++) {
        let data = parse(cifFile);
    }
    console.timeEnd('parse');
}

function oneTimeTest() {
    let data = parse(cifFile);
}
