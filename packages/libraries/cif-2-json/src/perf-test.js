const parse = window.cif2json.parse;
const cifFile = window.CIF_2222708;

function logExecutionTime() {
    console.time('parse');
    // norm - 500 ms; - to 38ms
    //
    for (let i = 0; i < 10; i++) {
        const data = parse(cifFile);
    }
    console.timeEnd('parse');
}

function oneTimeTest() {
    const data = parse(cifFile);
}
