const whatsappModel = require("./whatsappmodels");
const whatsappService = require("../services/whatsappService");
const authService = require("../services/authService");

function Process(textUser, number){
    const originalTextUser = textUser; // Keep original for password checking
    textUser = textUser.toLowerCase();
    var models = [];

    // Handle authentication commands first
    if (textUser.startsWith("login ")) {
        const password = originalTextUser.substring(6); // Remove "login " prefix
        const result = authService.attemptLogin(number, password);
        var model = whatsappModel.MessageText(result.message, number);
        models.push(model);
    }
    else if (textUser === "registrar") {
        authService.startRegistration(number);
        var model = whatsappModel.MessageText(authService.getRegistrationInstructions(), number);
        models.push(model);
    }
    else if (textUser === "logout") {
        const result = authService.logout(number);
        var model = whatsappModel.MessageText(result.message, number);
        models.push(model);
    }
    // Handle registration process
    else if (authService.getRegistrationStep(number) === 'waiting_password') {
        const result = authService.handleRegistrationPassword(number, originalTextUser);
        var model = whatsappModel.MessageText(result.message, number);
        models.push(model);
    }
    else if (authService.getRegistrationStep(number) === 'waiting_confirmation') {
        const result = authService.handleRegistrationConfirmation(number, originalTextUser);
        var model = whatsappModel.MessageText(result.message, number);
        models.push(model);
    }
    // Check authentication for regular commands
    else if (!authService.isAuthenticated(number)) {
        var model = whatsappModel.MessageText(authService.getAuthRequiredMessage(), number);
        models.push(model);
    }
    // Regular authenticated commands
    else {
        if(textUser.includes("hola")){
            //SAUDAR
            var model = whatsappModel.MessageText("Hola, un gusto saludarte. 👋", number);
            models.push(model);
            var modelList = whatsappModel.MessageList(number);
            models.push(modelList);
        }
        else if(textUser.includes("gracias")){
            // agradecimiento
            var model = whatsappModel.MessageText("Gracias a ti por escribirme. 😉😎", number);
            models.push(model);       

        }
        else if(textUser.includes("adios") ||
        textUser.includes("adiós")||
        textUser.includes("bye")||
        textUser.includes("me voy")
        ){
            // despedir
            var model = whatsappModel.MessageText("Ve con cuidado. 😊", number);
            models.push(model);
        }
        else if(textUser.includes("comprar")){
            // comprar
            var model = whatsappModel.MessageComprar(number);
            models.push(model);

        }
        else if(textUser.includes("vender")){
            // vender
            var model = whatsappModel.MessageText("👉 Regístrate en el siguiente formulario para poder evaluarte: https://form.jotform.com/222507994363665", number);
            models.push(model);       

        }
        else if(textUser.includes("agencia")){
            // agencia
            var model = whatsappModel.MessageText("Aquí tienes nuestra dirección. 😊", number);
            models.push(model);
            var modelLocation = whatsappModel.MessageLocation(number);
            models.push(modelLocation);       

        }
        else if(textUser.includes("contacto")){
            // vender
            var model = whatsappModel.MessageText("📞*Centro de contacto:*\n912345678", number);
            models.push(model);       

        }
        else{
            //No entiende
            var model = whatsappModel.MessageText("No entiendo lo que dices", number);
            models.push(model);
        }
    }

    models.forEach(model => {
        whatsappService.SendMessageWhatsApp(model);
    });
    


}

module.exports = {
    Process
};