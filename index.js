const fs = require('fs');
const Promise = require('bluebird');
const request = require('request');
const cheerio = require('cheerio');
const toMarkdown = require('to-markdown');
const program = require('commander');
const packageJson = require('./package.json');

program
    .version(packageJson.version)
    .command('convert [url]')
    .description('Converts Medium post to markdown from its url.')
    .option('-o, --outputDir <>', 'Output directory path.')
    .action(convert);

program.parse(process.argv);

const converters = [{
        filter: 'section',
        replacement: function(content) {
            return content;
        }
    },
    {
        filter: 'div',
        replacement: function(content) {
            return content;
        }
    },
    {
        filter: 'figure',
        replacement: function(content) {
            return content;
        }
    },
    {
        filter: 'figcaption',
        replacement: function(content) {
            return content;
        }
    }
];

function convert(url) {
    return new Promise(function(resolve, reject) {
        request({
            uri: url,
            method: 'GET'
        }, function(err, httpResponse, body) {
            if (err)
                return reject(err);
            let $ = cheerio.load(body);
            let html = $('.postArticle-content').html() || '';
            let markdown = toMarkdown(html, { gfm: true, converters: converters });
            resolve(markdown);
            var filename = url.substring(url.lastIndexOf('/') + 1) + '.md';
            const data = fs.writeFileSync(filename, markdown);
            console.log('saved to => %s', filename);
        });
    });
};

/*function run(url) {
    convertFromUrl(url).then(function(markdown) {
      var filename = url.substring(url.lastIndexOf('/') + 1) + '.md';
      fs.writeFileSync(filename, markdown);
      console.log('saved to => %s', filename);
    });
  };*/
