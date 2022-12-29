const { expect } = require('chai');
const mdToDraftJs = require('../src/mdToDraftjs');
const draftjsToMd = require('../src/draftjsToMd.js');
const { resolve } = require('path');
const { readFile } = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(readFile);

describe('mdToDraftJs -> draftjsToMd consistency', () => {
  it('produces the source Markdown input when converted to DraftJs and back', async () => {
    const source = await readFileAsync(resolve(__dirname, './sample.md'), 'utf8');
    expect(`${draftjsToMd(mdToDraftJs(source))}\n`).to.equal(source);
  });
});
