const Discord = require('./node_modules/discord.js')
const fetch = require('./node_modules/node-fetch');

const client = new Discord.Client()
let memeCounter = 0
let ppCounter = 0
let memes
let pp

client.on("message", async msg => {

    //    if (msg.author.username == "Kinda_Happy") {
    //        let user = msg.author; //grabbing the user mention
    //        user.send(msg);
    //        console.log("I send msg to him")
    //    }

    if (msg.content == "!meme") {
        if (memes == undefined || memes == null) {
            fetch('https://www.reddit.com/r/dankmemes/.json')
                .then(res => res.json())
                .then(json => {
                    memes = json.data.children
                    waitforMeme()
                    return memes
                });
        } else {
            waitforMeme()
        }

        function waitforMeme() {
            let title = memes[memeCounter].data.title
            let pic = memes[memeCounter].data.url_overridden_by_dest
            if (title == undefined || pic == undefined || pic.includes(".gifv")) {
                memeCounter++
                waitforMeme()
                return memeCounter
            } else {
                console.log(title + "    " + pic)
                msg.channel.send("**" + title + "**", {
                    files: [pic]
                })
                memeCounter++
                return memeCounter
            }
        }

    }

    if (msg.content == "!porn") {
        if (pp == undefined || pp == null) {
            fetch('https://www.reddit.com/r/porn/.json')
                .then(res => res.json())
                .then(json => {
                    pp = json.data.children
                    console.log(pp)
                    waitforpp()
                    return pp
                });
        } else {
            waitforpp()
        }

        function waitforpp() {

            let title = pp[ppCounter].data.title
            let pic = pp[ppCounter].data.url_overridden_by_dest
            if (title == undefined || pic == undefined) {
                ppCounter++
                waitforpp()
                return ppCounter
            } else {
                console.log(title + "    " + pic)
                if (pic.includes(".png")) {
                    msg.channel.send("**" + title + "**", {
                        files: [pic]
                    })
                } else {
                    msg.channel.send("**" + title + "**\n" + pic)
                }
                ppCounter++
                return ppCounter
            }
        }

    }




    if (msg.content == "!random") {
        msg.guild.members.fetch().then(fetchedMembers => {
            const totalOnline = fetchedMembers.filter(member => member.presence.status === 'online' || member.presence.status === 'idle' || member.presence.status === 'dnd');
            let onlineUsers = []
            totalOnline.forEach(totalOnline => {
                if (!totalOnline.user.bot) {
                    console.log("[ONLINE] " + totalOnline.user.username)
                    onlineUsers.push(totalOnline.user.username)
                }
            });

            let random = Math.floor(Math.random() * onlineUsers.length);
            console.log("<@" + onlineUsers[random] + ">")
        })
    }
    if (msg.content == "!ph") msg.channel.send("!ph search <input> <amount of results>")
    if (msg.content.startsWith("!ph search ")) {
        let searchAmount = 5
        let search = msg.content.replace("!ph search ", "")
        console.log("searhing....")
        let getNumber = msg.content.split(" ")
        getNumber = getNumber[getNumber.length - 1]
        if (!isNaN(getNumber)) {
            if (getNumber > 10) {
                msg.channel.send("Max is 10 vids!")
                return
            }
            if (getNumber < 1) {
                msg.channel.send("Min is 1 vid!")
                return
            }
            searchAmount = getNumber
        }
        fetch('https://www.pornhub.com/webmasters/search?search=' + search)
            .then(res => res.json())
            .then(json => {
                if (json.videos == undefined) {
                    msg.channel.send("**No results for:**\t " + search)
                    return
                }
                let videos = []
                for (let i = 0; i < searchAmount; i++) {
                    let vid = json.videos[i]
                    let categories = []
                    for (let s = 0; s < vid.categories.length; s++) {
                        categories.push(vid.categories[s].category)
                    }
                    if (categories.length > 1) categories = categories.join(", ")

                    let tags = []
                    for (let s = 0; s < vid.tags.length; s++) {

                        tags.push(vid.tags[s].tag_name)

                    }
                    if (tags.length > 1) tags = tags.join(", ")

                    let pornstars = []
                    if (vid.pornstars !== "" || vid.pornstars !== [] || vid.pornstars !== undefined || " ") {
                        for (let s = 0; s < vid.pornstars.length; s++) {
                            pornstars.push(vid.pornstars[s].pornstar_name)

                        }

                        if (pornstars.length > 1) pornstars = pornstars.join(", ")
                    } else {
                        pornstars = " / "
                    }

                    msg.channel.send({
                        embed: {
                            "title": vid.title,
                            "description": "**views:** " + vid.views + "\n**Duration:** " + vid.duration + "\n**Pornstars:** " + pornstars + "\n**Categories:** +" + categories + "\n**Tags:** " + tags,
                            "url": vid.url,
                            "color": 7506394,
                            "footer": {
                                "text": vid.segment + "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t" + vid.publish_date
                            },
                            "thumbnail": {
                                "url": vid.thumb
                            }
                        }
                    })
                }

            });
    }


})


client.login(process.env.token);
