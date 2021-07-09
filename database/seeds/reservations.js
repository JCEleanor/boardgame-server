// the purpose of this file is to seed data into reservations table.
// run this: node database/seeds/reservations.js
// ***** process.env is not availible!

// 在７/9 － 9/30 隨機日期、隨機一個時間，點植入一個訂單

// Nano ID Collision Calculator: https://zelark.github.io/nano-id-cc/

// 目前(20210709)資料庫只有三個人，先預設有20個會員，降低 在會員查詢中心時發現同個會員有太多訂單，或日期相撞的訂單 的機率 

const { nanoid } = require('nanoid')
const { promisePool } = require('../db.connect')

// total booking records: 100
const totalData = 100

function randdomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const dateFormatter = (date) => {
    let month = '' + (date.getMonth() + 1)
    let day = '' + date.getDate()
    let year = date.getFullYear()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    return [year, month, day].join('-')
}


const seedToDatabase = async () => {
    try {
        for (let i = 0;i < totalData;i++) {

            // the month is 0-indexed
            const date = randomDate(new Date(2021, 6, 10), new Date(2021, 8, 30))
            const id = nanoid(8)

            const sql = `INSERT INTO reservations (reservationId, userId, date, startTime, storeId, numberOfPeople) VALUE('${id}',${randdomNum(1, 20)},'${dateFormatter(date)}',${randdomNum(13, 21)},${randdomNum(1, 2)},4)`
            const [rows, fields] = await promisePool.query(sql)
            if (rows.affectedRows > 0) {
                console.log(`success! reservationId: ${id}`)
            }
        }
    }
    catch (e) {
        console.log(e);
    }
}

const truncateDatabase = async () => {
    try {
        const sql = "TRUNCATE reservations"
        const [rows, fields] = await promisePool.query(sql)
        if (rows.affectedRows > 0) {
            console.log(`successfully truncate reservations`)
        }
    }
    catch (e) {
        console.log('error: ',e);
    }
}

//truncateDatabase()
seedToDatabase()
    



// for seeding database

// const connection = {
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'boardgame',
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
//   }