/* This is a cli post-util for blog theme <spark>*/
'use strict';

const fs = require('fs');
const readline = require('readline');
const mysql = require('mysql');
const config = require('./config.js');
const date = require('./date.js');

let connection = mysql.createConnection(config);

let stdConfig = {
    input: process.stdin,
    output: process.stdout
};

function worker() { 
    (function () {
        console.clear();
        console.log(`Hello ${config.user}`);
        console.log('');
        console.log('1. initialize/change <user information>');
        console.log('2. post/modify/delete <post>');
        console.log('3. post/modify/delete <note>');
        console.log('4. create/modify page <about>');
        console.log('5. update/delete your <friendlist>')
    })();
    let r = readline.createInterface({
        input: process.stdin,
        output: process.output,
        prompt: '|>',
    });
    r.prompt();
    r.on('line', _ => {
        let func = _.trim();
        if (func === '1') {
            r.close();
            let header, githubref, username;
            let rl = readline.createInterface(stdConfig);
            rl.question('header:', answer => {
                header = answer;
                rl.question('githubref:', answer => {
                    githubref = answer;
                    rl.question('username:', answer => {
                        username = answer;
                        connection.query('select * from user', (e, results) => {
                            if (results) {
                                connection.query('update user set header=?, githubref=?, username=?', [header, githubref, username], (err, results) => {
                                    if (e) throw e;
                                    process.exit(1);
                                });
                            } else {
                                connection.query("insert into user (header, githubref, username)values(?, ?, ?)", [header, githubref, username], (e, results) => {
                                    if (e) throw e;
                                    process.exit(1);
                                });
                            }
                        })
                    })
                })
            });
        } else if (func === '2') {
            console.clear();
            console.log('1. post');
            console.log('2. modify');
            console.log('3. delete');
            r.close();
            let rr = readline.createInterface(stdConfig);
            rr.on('line', _ => {
                let choice = _.trim();
                rr.close();
                if (choice === '1') {
                    let title, text, coverimage, author;
                    let rt = readline.createInterface(stdConfig);
                    rt.question('title:', answer => {
                        title = answer;
                        rt.question('text:', answer => {
                            let t = fs.readFileSync(`./posts/${answer}`);
                            text = t.toString();
                            rt.question('coverimage:', answer => {
                                coverimage = answer;
                                rt.question('author:', answer => {
                                    author = answer;
                                    let sdate = JSON.stringify(date);
                                    connection.query(`insert into post (title, content, posttime${coverimage ? ',coverimage ' : ''}${author ? ',author' : ''})values(?, ?, ? ${coverimage ? ',?' : ''}${author ? ',?' : ''})`,
                                        [title, text, sdate, coverimage, author], (err, results) => {
                                            if (err) throw err;
                                            rt.close(_ => {
                                                process.exit(1);
                                            });
                                        });
                                })
                            })
                        })
                    })
                } else if (choice === '2') {
                    connection.query('select id, title from post', (e, results) => {
                        let title, content, coverimage, id;
                        console.log(results);
                        rr.close();
                        let r1 = readline.createInterface(stdConfig);
                        r1.question('id: ', answer => {
                            id = answer;
                            r1.question('title: ', answer => {
                                title = answer;
                                r1.question('content:', answer => {
                                    if (answer) {
                                        let t = fs.readFileSync(`./posts/${answer}`);
                                        content = t.toString();
                                    } else {
                                        content = ''
                                    }
                                    r1.question('coverimage:', answer => {
                                        coverimage = answer;
                                        if (title) {
                                            connection.query(`update post set title=? where id=?`, [title, id], (e, results) => {
                                                if (e) throw e;
                                            });
                                        }
                                        if (content) {
                                            connection.query(`update post set content=? where id=?`, [content, id], (e, results) => {
                                                if (e) throw e;
                                            });
                                        }
                                        if (coverimage) {
                                            connection.query(`update post set coverimage=? where id=?`, [coverimage, id], (e, results) => {
                                                if (e) throw e;
                                            });
                                        }
                                        process.exit(1);
                                    });
                                })
                            })
                        })
                    });
                } else if (choice === '3') {
                    connection.query('select id, title from post', (e, results) => {
                        console.log(results);
                        rr.close();
                        let r1 = readline.createInterface(stdConfig);
                        r1.question('id: ', answer => {
                            let id = answer;
                            connection.query(`delete from post where id=?`, [id], (e, results) => {
                                console.log('success');
                                r1.close(_ => {
                                    process.exit(1)
                                });
                            })
                        })
                    })
                }
            })
        } else if (func === '3') {
            console.clear();
            console.log('1. post');
            console.log('2. modify');
            console.log('3. delete');
            r.close();
            let rr = readline.createInterface(stdConfig);
            rr.on('line', _ => {
                let choice = _.trim();
                rr.close();
                if (choice === '1') {
                    let title, content;
                    let rt = readline.createInterface(stdConfig);
                    rt.question('title:', answer => {
                        title = answer;
                        rt.question('content:', answer => {
                            content = fs.readFileSync(`./notes/${answer}`);
                            let sdate = JSON.stringify(date)
                            connection.query(`insert into note (title, content, posttime)values(?, ?, ?)`, [title, content, sdate], (e) => {
                                if (e) throw e;
                                process.exit(1);
                            });
                        })
                    })
                } else if (choice === '2') {
                    connection.query('select id, title from note', (e, results) => {
                        if (e) throw e;
                        let id, title, content;
                        console.log(results);
                        let rt = readline.createInterface(stdConfig);
                        rt.question('id:', answer => {
                            id = answer;
                            rt.question('title:', answer => {
                                title = answer;
                                rt.question('content:', answer => {
                                    content = answer ? fs.readFileSync(`./notes/${answer}`) : '';
                                    if (title) {
                                        connection.query('update note set title=? where id=?', [title, id], (e) => {
                                            if (e) throw e;
                                        });
                                    }
                                    if (content) {
                                        connection.query('update note set content=? where id=?', [content, id], (e) => {
                                            if (e) throw e;
                                        })
                                    }
                                    process.exit(1);
                                })
                            })
                        })
                    })
                } else if (choice === '3') {
                    connection.query('select id, title from note', (e, results) => {
                        if (e) throw e;
                        console.log(results);
                        let rt = readline.createInterface(stdConfig);
                        rt.question('id:', answer => {
                            connection.query('delete from note where id=?', [answer], (e) => {
                                if (e) throw e;
                                process.exit(1);
                            });
                        });
                    });
                }
            });
        } else if (func === '4') {
            console.clear();
            r.close();
            let rt = readline.createInterface(stdConfig);
            rt.question('content:', answer => {
                let content = fs.readFileSync(`./about/${answer}`);
                connection.query('update about set content=?', [content], (e) => {
                    if (e) throw e;
                    process.exit(1);
                })
            });
        } else if (func === '5') {
            console.clear();
            console.log('1. create');
            console.log('2. modify');
            console.log('3. delete');
            r.close();
            let rt = readline.createInterface(stdConfig);
            rt.on('line', _ => {
                let choice = _.trim();
                if (choice === '1') {
                    let nickname, website;
                    rt.close();
                    let rr = readline.createInterface(stdConfig);
                    rr.question('nickname:', answer => {
                        nickname = answer;
                        rr.question('website:', answer => {
                            website = answer;
                            connection.query('insert into friends(nickname, website)values(?, ?)', [nickname, website], (e) => {
                                if (e) throw e;
                                process.exit(1);
                            })
                        })
                    });
                } else if (choice === '2') {
                    let id, nickname, website;
                    rt.close();
                    connection.query('select id, nickname from friends', (e, results) => {
                        if (e) throw e;
                        console.log(results);
                        let rr = readline.createInterface(stdConfig);
                        rr.question('id:', answer => {
                            id = answer;
                            rr.question('nickname:', answer => {
                                nickname = answer;
                                rr.question('website:', answer => {
                                    website = answer;
                                    if (nickname) {
                                        connection.query('update friends set nickname=? where id=?', [nickname, id], (e) => {
                                            if (e) throw e;
                                        });
                                    } 
                                    if (website) {
                                        connection.query('update friends set website=? where id=?', [website, id], (e) => {
                                            if (e) throw e;
                                        })
                                    }
                                    process.exit(1);
                                })
                            });
                        })
                    })  
                } else if (choice === '3') {
                    console.clear();
                    r.close()
                    connection.query('select id, nickname from friends', (e, results) => {
                        if (e) throw e;
                        let id = '';
                        console.log(results);
                        let rr = readline.createInterface(stdConfig);
                        rr.question('id:', answer => {
                            id = answer;
                            connection.query('delete from friends where id=?', [id], (e) => {
                                if (e) throw e;
                            })
                        })
                    })
                }
            })
        }
    });
}
worker();