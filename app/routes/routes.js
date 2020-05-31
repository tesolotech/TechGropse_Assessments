var multer  = require('multer')
var upload = multer({ dest: '../uploads/' })

module.exports = (app) => {
    const controller = require('../controllers/controller.js');

    app.get('/api/marco_polo/:startR/:endR',controller.GetMarcoPole);
    
    // Generate Invoice No
    // app.post('/api/SingleInvoiceUpload', upload.single('avatar.txt'), controller.GetDecodedFile);

    
}

