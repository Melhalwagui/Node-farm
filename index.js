const fs = require('fs'); //module
const http = require('http'); //module to build an http server
const url = require('url');
////////////require my own modules////////////
const replaceTemplate = require('./modules/replaceTemplate')
////////////require 3rd party modules installed frpm npm////////////
const slugify = require('slugify');


//////////////////////////////////////////////////
//FILES


//Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt' , 'utf-8'); //we need to specify the encoding 
// console.log(textIn);
// const textOut = `This is what we know about avocado: ${textIn}. \nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt',textOut);
// console.log('file written');

//Non-blocking , asynchronous
// fs.readFile('./txt/startttt.txt', 'utf-8',(err,data1) =>{
//     if (err) return console.log("errroror");
//     fs.readFile(`./txt/${data1}.txt` , 'utf-8' , (err, data2) =>{
//         console.log(data2)
//         fs.readFile('./txt/append.txt', 'utf-8',(err,data3)=>{
//             console.log(data3);
//             fs.writeFile('./txt/final.txt' ,`${data2}\n${data3}` ,'utf-8' , err => {
//                 console.log("your file has been written!");
//             })
//         });
//     });
// }); // 

// console.log('will read file !');

///////////////////////////////////////////////
//SERVER













const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');

const dataObj = JSON.parse(data); //array of json objects [5 objects]

const slugs = dataObj.map(el => slugify(el.productName,{lower:true})); //making productnames lowercase

const server = http.createServer((req , res)=>{
    
    const {query , pathname} = url.parse(req.url,true);
    const pathName = req.url;
    //overview page
    if( pathname === '/' || pathname === '/overview'){
        
        res.writeHead(200 , {'Content-type':'text/html'});
        //map function to get the data from json
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard,el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml); 
        res.end(output);
    //product page
    }else if (pathname === '/product'){
        res.writeHead(200 , {'Content-type':'text/html'});
        const product = dataObj[query.id]; //get the element by id
        const ouput = replaceTemplate(tempProduct,product);
        res.end(ouput);

    //API
    }else if (pathname === '/api') {
        res.writeHead(200, {'Content-type':'application/json'});
        res.end(data);
    
    //Not found
    }else{
        res.writeHead(404, {
            //http header
            'Content-type':'text/html',
            'my-own-header':'hello-world'
        });
        res.end('<h1>Page not found</h1>');
    }
    
});

server.listen(8000, '127.0.0.1' , ()=>{
    console.log('listening to requests on port 8000');
}); //port & local host 



