import {getAllTestFiles} from "./test_discovery";

test('discovery', async () => {
    const discovered = await getAllTestFiles('./', '**/*.test.sql');
    expect(discovered.length).toBeGreaterThan(1);
});
