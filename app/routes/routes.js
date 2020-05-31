

module.exports = (app) => {
    const controller = require('../controllers/controller.js');



    app.get('/api/marco_polo/:startR/:endR',controller.GetMarcoPole);
    
   
    app.get('/api/user/:userId',controller.GetUserById);
    
    // app.put('/api/user/:userId', users.UpdateUserById);

    // Add new contact
    // app.post('/api/addContact', users.AddContacts);

 
    
}

