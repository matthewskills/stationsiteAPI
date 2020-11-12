process.env.PORT = 8081;

const expect = require('chai').expect;
const request = require('supertest');
const sqlite3 = require('sqlite3');

const app = require('../index.js');

const prodDb = new sqlite3.Database('./database.sqlite');

describe('Stations Table', function() {
    it('should exist', function(done) {
        prodDb.get("SELECT name FROM sqlite_master WHERE type='table' AND name='stations'", (error,table) => {
            if (error || !table) {
                done(new Error(error || 'The Stations Table was not found'));
            }
            if (table) {
                done();
            }
        })
    })
    it('should contain the following columns: id,name,description,tagline,logo,website_url,stream_url', function(done) {
        prodDb.run(`INSERT INTO stations (name,description,tagline,logo,website_url,stream_url) VALUES ('Name', 'Description', 'Tagline', 'logo.jpg', 'http://website.com', 'http://website.com')`,
         function(error) {
            if(error) {
                done(new Error(error));
            } else {
                prodDb.run(`DELETE FROM stations WHERE stations.id = ${this.lastID}`, () => {
                    expect(this.lastID).to.exist;
                    done();
                })
            }
        })
    })
})