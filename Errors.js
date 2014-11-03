var Errors;

Errors = {
    ArgumentMissing: function(argument) {
        this.argument = argument;
    },
    InvalidOperation: function(message) {
        this.message = message;
    }
}


module.exports = Errors;
