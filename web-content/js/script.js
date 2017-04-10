var TicTacToeGame = function () {
    var gameEnded = false,
        fields;

    this.computerPlayer = '';
    this.turn = 'X';
    this.fields = {
        field1: {
            value: '',
            adjacents: {
                vertically: ['field4', 'field7'],
                horizontally: ['field2', 'field3'],
                diagonally_left_to_right: ['field5', 'field9']
            }
        },
        field2: {
            value: '',
            adjacents: {
                vertically: ['field5', 'field8'],
                horizontally: ['field1', 'field3']
            }
        },
        field3: {
            value: '',
            adjacents: {
                vertically: ['field6', 'field9'],
                horizontally: ['field1', 'field2'],
                diagonally_right_to_left: ['field5', 'field7']
            }
        },
        field4: {
            value: '',
            adjacents: {
                vertically: ['field1', 'field7'],
                horizontally: ['field5', 'field6']
            }
        },
        field5: {
            value: '',
            adjacents: {
                vertically: ['field2', 'field8'],
                horizontally: ['field4', 'field6'],
                diagonally_left_to_right: ['field1', 'field9'],
                diagonally_right_to_left: ['field3', 'field7']
            }
        },
        field6: {
            value: '',
            adjacents: {
                vertically: ['field3', 'field9'],
                horizontally: ['field4', 'field5']
            }
        },
        field7: {
            value: '',
            adjacents: {
                vertically: ['field1', 'field4'],
                horizontally: ['field8', 'field9'],
                diagonally_right_to_left: ['field3', 'field5']
            }
        },
        field8: {
            value: '',
            adjacents: {
                vertically: ['field2', 'field5'],
                horizontally: ['field7', 'field9']
            }
        },
        field9: {
            value: '',
            adjacents: {
                vertically: ['field3', 'field6'],
                horizontally: ['field7', 'field8'],
                diagonally_left_to_right: ['field1', 'field5']
            }
        }
    };

    fields = this.fields;

    /** Private methods */

    /**
     * shuffle array in random order, return the nes
     * shuffled array
     */
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i -= 1) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    /** End of private methods */

    /** Public methods */

    /**
     * Check if the field, which was clicked last, introduced
     * the winner of the game
     * Pass in a call back function that will handle the winning fields
     */
    this.detectWinner = function (fieldClicked, cb) {
        var adjacent,
            adjFields,
            wonFields,
            currentField = fields[fieldClicked];

        for (adjacent in currentField.adjacents) {
            adjFields = currentField.adjacents[adjacent];

            if (adjFields.length > 0 &&
                fields[adjFields[0]].value === fields[adjFields[1]].value &&
                fields[adjFields[0]].value === currentField.value) {
                wonFields = [adjFields[0], adjFields[1], fieldClicked];
                gameEnded = true;

                cb(currentField.value, wonFields);
            }
        }
    };

    /**
     * restart the game - set all fields to empty and
     * set the state of the game to not ended
     */
    this.restart = function () {
        var field,
            clearedFields = [];

        gameEnded = false;

        for (field in fields) {
            fields[field].value = '';
            clearedFields.push(field);
        }

        return clearedFields;
    };

    /**
     * choose a random field, which is free, by the computer player
     */
    this.takeTurn = function() {
        var field, i,
            emptyFields = [],
            shuffledFields,
            cField,
            adjacent,
            f1, f2;

        // gather the empty fields in an array
        for (field in fields) {
            if (fields[field].value === '') {
                emptyFields.push(field);
            }
        }

        // return the empty field which can make the computer player a winner
        for ( i = 0; i <  emptyFields.length; i += 1 ) {
            cField = fields[emptyFields[i]];
            for ( adjacent in cField.adjacents ) {
                f1 = cField.adjacents[adjacent][0];
                f2 = cField.adjacents[adjacent][1];
                if (this.computerPlayer !== '' &&
                    fields[f1].value === this.computerPlayer &&
                    fields[f2].value === this.computerPlayer) {

                    console.log('w ' + emptyFields[i]);
                    return emptyFields[i];
                }
            }
        }

        // return the em[ty field which could make the human player a winner
        for ( i = 0; i <  emptyFields.length; i += 1 ) {
            cField = fields[emptyFields[i]];
            for (adjacent in cField.adjacents) {
                f1 = cField.adjacents[adjacent][0];
                f2 = cField.adjacents[adjacent][1];

                if (this.computerPlayer !== '' && 
                    fields[f1].value !== '' && 
                    fields[f2].value !== '' &&
                    fields[f1].value !== this.computerPlayer &&
                    fields[f2].value !== this.computerPlayer) {

                    console.log('l ' + emptyFields[i]);
                    return emptyFields[i];
                }
            }
        }

        // shuffle the array of empty fields
        shuffledFields = shuffleArray(emptyFields);
        fields[shuffledFields[0]].value = this.computerPlayer;
        return shuffledFields[0];
    };

    this.isGameEnded = function() {
        return gameEnded;
    };
    /** End of public methods */

};

$(document).ready(function() {

    var game = new TicTacToeGame(),
        messageBox = $("#message"),
        computerPlayerField,
        markField = function(field, fieldSelector) {
            fieldSelector = fieldSelector || ('#' + field);
            $(fieldSelector).html(game.turn);
            game.fields[field].value = game.turn;
            game.turn = (game.turn === 'X' ? 'O' : 'X');
        },
        reportWinner = function (winner, wonFields) {
            var msg, msgStyle, fieldStyle, i;

            if (winner === game.computerPlayer) {
                msg = 'You LOST!';
                msgStyle = 'lost_message';
                fieldStyle = 'lost_box';
                game.computerPlayer = 'X';
            } else {
                msg = 'You WON!';
                msgStyle = 'won_message';
                fieldStyle = 'won_box';
                game.computerPlayer = 'O';
            }
            messageBox.addClass(msgStyle);
            messageBox.html(msg);

            for (i = 0; i < wonFields.length; i += 1) {
                $('#' + wonFields[i]).addClass(fieldStyle);
            }
        },
        displayPlayers = function() {
            var humanPlayer = (game.computerPlayer === 'X' ? 'O' : 'X'),
                msg = 'You are ' + humanPlayer + '<br>I am ' + game.computerPlayer;
            messageBox.html(msg);
        };

    game.computerPlayer = 'X';
    displayPlayers();

    if (game.computerPlayer === game.turn) {
        computerPlayerField = game.takeTurn();
        markField(computerPlayerField);
    }

    $(".box").click(function () {
        var userSelectedField = this.id;

        if ($(this).html() === '' && !game.isGameEnded()) {

            /** Human's turn */
            markField(userSelectedField, this);
            game.detectWinner(userSelectedField, reportWinner);
            /** Human's turn ends */

            /** Computer's turn */
            if (game.computerPlayer === game.turn && !game.isGameEnded()) {
                computerPlayerField = game.takeTurn();
                markField(computerPlayerField);
            } else {
                console.log('Game ended!');
            }
            game.detectWinner(computerPlayerField, reportWinner);
            /** Computer's turn ends */
        }
    });

    $(".restart").click(function () {
        var clearedFields = game.restart(),
            fieldSelector;

        messageBox.html('');
        messageBox.removeClass('won_message lost_message');

        for (var i = 0; i < clearedFields.length; i += 1) {
            fieldSelector = $('#' + clearedFields[i]);
            fieldSelector.html('');
            fieldSelector.removeClass('won_box lost_box');
        }
        game.turn = 'X';
        if (game.computerPlayer === game.turn) {
            computerPlayerField = game.takeTurn();
            markField(computerPlayerField);
        }

        displayPlayers();
    });
});