
var path  = require('path')

// Get GetEmployees list
exports.GetMarcoPole = (req,res) => {
    const start = Number(req.params.startR);
    const end = Number(req.params.endR);
    var Output='';
    if(start < 1 && end > 1000000){
        res.send(401).json({message:'Start and end point must be between 1 to 1,000,000'});
    }
    console.log(typeof(start));
    for(let i = start; i <= end; i++){
        if((i%4 == 0) && (i%7==0) ){
            if(i == start){
                Output = 'marcopolo';
            }else{
                Output = Output + ',' + 'marcopolo'
            }
        }else if(i%4 == 0){
            if(i == start){
                Output = 'marco';
            }else{
                Output = Output + ',' + 'marco'
            }
        }else if(i%7 == 0){
            if(i == start){
                Output = 'polo';
            }else{
                Output = Output + ',' + 'polo'
            } 
        }else{
            if(i == start){
                Output = i;
            }else{
                Output = Output + ',' + i
            } 
        }
    }
    res.status(200).json({
        message:'Welcome To Marco Polo Game',
        result:Output
    })
}


exports.GetDecodedFile = (req,res) =>{
    console.log(req.file);
    res.status(200).sendFile('InvoiceReadingResult.txt',{ root: path.join(__dirname, '../..') })

}
