import {PSqlRunner} from "./psql_runner";

test('runner running', async () => {
    const runner = new PSqlRunner({
        psqlExecutable: 'psql',
        uri: 'postgres://postgres:ubdugus@127.0.0.1/infiscenario_staging',
        timeout: 10000
    }, ['-c', 'select 1;']);

    await runner.joinRunner();
    expect(runner.exitOk).toBeTruthy();
    expect(runner.stdoutData.length).toBeTruthy();
    expect(runner.stderrData.length).toBeFalsy();
});


test('runner failing', async () => {
    const runner = new PSqlRunner({
        psqlExecutable: 'psql',
        uri: 'postgres://postgres:ubdugus@127.0.0.1/infiscenario_staging',
        timeout: 10000
    }, ['-c', 'select whateverthatis();']);

    await runner.joinRunner();
    expect(runner.exitOk).toBeFalsy();
    expect(runner.stdoutData.length).toBeFalsy();
    expect(runner.stderrData.length).toBeTruthy();
});
