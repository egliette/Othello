////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////
////////    OTHELLO CHESS use minimax algorithm
////////
////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
var sketchProc = function(processingInstance) {
    with (processingInstance) {
       size(400, 400); 
       frameRate(30);
       
       // ProgramCodeGoesHere

       // Board's constant
       var BOARD_EDGE = 400;
       var BOARD_SIZE = 8;

       ////////////////////////////////////////////////////////////////
       ////////////////////////////////////////////////////////////////


       // Game's constant
       var playerPiece = "W";
       var gameScene = "onePlayer";



       ////////////////////////////////////////////////////////////////
       ////////////////////////////////////////////////////////////////
       // Tile's constant
       var TILE_EDGE = BOARD_EDGE/BOARD_SIZE;
       var CHESS_RADIUS = TILE_EDGE/1.25;

       // Tile object
       var Tile = function(x, y)
       {
           this.x = x;
           this.y = y;
           this.face = "E";
       };

       // Tile drawing method
       Tile.prototype.draw = function()
       {
           fill(47, 161, 16);
           rect(this.x,this.y-TILE_EDGE,TILE_EDGE,TILE_EDGE);
           if (this.face === "W")
           {
               fill(255, 255, 255);
               ellipse(this.x+TILE_EDGE/2,this.y-TILE_EDGE/2,
                       CHESS_RADIUS,CHESS_RADIUS);
           }
           else if (this.face === "B")
           {
               fill(0, 0, 0);
               ellipse(this.x+TILE_EDGE/2,this.y-TILE_EDGE/2,
                       CHESS_RADIUS,CHESS_RADIUS);
           }
       };

       Tile.prototype.isUnderMouse = function(x,y)
       {
           return (x>=this.x && x<=this.x+TILE_EDGE &&
                   y>=this.y-TILE_EDGE && y<=this.y);
       };

       Tile.prototype.getCopy = function()
       {
           var copy = new Tile();
           copy.x = this.x;
           copy.y = this.y;
           copy.face = this.face;
           return copy;
       };

       ////////////////////////////////////////////////////////////////
       ////////////////////////////////////////////////////////////////

       // W = O ; B = X


       // Board object
       var Board = function()
       {
           this.whoseTurn = "W";
           this.Tiles = new Array(BOARD_SIZE);
           for (var i = 0;i<BOARD_SIZE;i++)
           {
               this.Tiles[i] = new Array(BOARD_SIZE);
               for (var j = 0; j < BOARD_SIZE; j++)
               {
                   this.Tiles[i][j] = new Tile(i*TILE_EDGE,400-j*TILE_EDGE);
               }
           }
           this.Tiles[3][3].face = "W";
           this.Tiles[4][4].face = "W";
           this.Tiles[3][4].face = "B";
           this.Tiles[4][3].face = "B";

       };                              


       Board.prototype.getWhosePiece = function()
       {   return this.whoseTurn;  };

       Board.prototype.getOpponentPiece = function()
       {   if (this.whoseTurn === "B")
           { 
               return "W";
           }
           return "B";
       };

       Board.prototype.setCurrentPlayer = function(player)
       {
           this.whoseTurn = player;
       };

       // Board drawing method
       Board.prototype.draw = function() {
           // Board's background
           background(7, 87, 9);

           for (var i = 0; i < BOARD_SIZE; i++)
           {
               for (var j = 0; j < BOARD_SIZE; j++)
               {
                   this.Tiles[i][j].draw();
               }
           }
           //fill(255, 0, 0);
           //textSize(20);
           //text(turn,13,10,100,100);
       };
       var count = 0;
       // Checks a direction from x,y to see if we can make a move
       Board.prototype.checkFlip = function(x, y, deltaX, deltaY)
       {

         var opponentPiece = this.getOpponentPiece();
         var myPiece = this.whoseTurn;

         if (x<0 || y<0 || x>=8 || y>=8)
         { return false; }

         if (this.Tiles[x][y].face === opponentPiece)
         { 
           while ((x >= 0) && (x < 8) && (y >= 0) && (y < 8))
           {
             x += deltaX;
             y += deltaY;
             // BUG in original code, allows -1 or 8. For example
             // if x = 0 and deltaX is -1, then now x = -1
             // I patched this with another if statement, but it might be better
             // to move the += to the bottom of the loop

             if ((x >= 0) && (x < 8) && (y >= 0) && (y < 8))
             {
               if (this.Tiles[x][y].face === 'E')	// not consecutive
               {	return false;   }
               if (this.Tiles[x][y].face === myPiece)
               {	return true;    }		// At least one piece we can flip
               else
               {
                 // It is an opponent piece, just keep scanning in our direction
               }
             }
           }
         }
         return false; // Either no consecutive opponent pieces or hit the edge of the board
       };


       // Flips pieces in the given direction until we don't hit any more opponent pieces.
       // Assumes this is a valid direction to flip (we eventually hit one of our pieces).
       Board.prototype.flipPieces = function(x, y, deltaX, deltaY)
       {
         while (this.Tiles[x][y].face === this.getOpponentPiece())
         {
           this.Tiles[x][y].face = this.whoseTurn;
           x += deltaX;
           y += deltaY;
         }
       };


       // Makes a move on the board, assumes the move is valid.
       Board.prototype.makeMove = function(x,y)
       {
         // Put the piece at x,y
         this.Tiles[x][y].face = this.whoseTurn;

         // Check to the left
         if (this.checkFlip(x - 1, y, -1, 0))
         {	this.flipPieces(x - 1, y, -1, 0);    }
         // Check to the right
         if (this.checkFlip(x + 1, y, 1, 0))
         {	this.flipPieces(x + 1, y, 1, 0);    }
         // Check down
         if (this.checkFlip(x, y - 1, 0, -1))
         {	this.flipPieces(x, y - 1, 0, -1);    }
         // Check up
         if (this.checkFlip(x, y + 1, 0, 1))
         {	this.flipPieces(x, y + 1, 0, 1);    }
         // Check down-left	
         if (this.checkFlip(x - 1, y - 1, -1, -1))
         {	this.flipPieces(x - 1, y - 1, -1, -1);  }
         // Check down-right
         if (this.checkFlip(x + 1, y - 1, 1, -1))
         {	this.flipPieces(x + 1, y - 1, 1, -1);   }
         // Check up-left	
         if (this.checkFlip(x - 1, y + 1, -1, 1))
         {	this.flipPieces(x - 1, y + 1, -1, 1);   }
         // Check up-right
         if (this.checkFlip(x + 1, y + 1, 1, 1))
         {	this.flipPieces(x + 1, y + 1, 1, 1);    }
       };



       // Returns true if the move is valid, false if invalid
       Board.prototype.validMove = function(x, y)
       {

         // Check that the coordinates are empty
         if (this.Tiles[x][y].face !== 'E')
         {	return false;   }

         // If we can flip in any direction, it is valid
         // Check to the left
         if (this.checkFlip(x - 1, y, -1, 0))
         {	return true;    }

         // Check to the right
         if (this.checkFlip(x + 1, y, 1, 0))
         {	return true;    }

         // Check down
         if (this.checkFlip(x, y - 1, 0, -1))
         {	return true;    }

         // Check up
         if (this.checkFlip(x, y + 1, 0, 1))
         {	return true;    }

         // Check down-left	
         if (this.checkFlip(x - 1, y - 1, -1, -1))
         {	return true;    }

         // Check down-right
         if (this.checkFlip(x + 1, y - 1, 1, -1))
         {	return true;    }

         // Check up-left	
         if (this.checkFlip(x - 1, y + 1, -1, 1))
         {	return true;    }

         // Check up-right
         if (this.checkFlip(x + 1, y + 1, 1, 1))
         {	return true;    }

         return false; // If we get here, we didn't find a valid flip direction
       };

       // Fills in the arrays with valid moves for the piece.  numMoves is the number of valid moves.
       Board.prototype.getMoveList = function(moveX, moveY, numMoves)
       {

         numMoves[0] = 0;  // Initially no moves found

         // Check each square of the board and if we can move there, remember the coordinates
         for (var x = 0; x < 8; x++)
         {
           for (var y = 0; y < 8; y++)
           {

             if (this.validMove(x, y)) // If find valid move, remember coordinates
             {
               moveX[numMoves[0]] = x;
               moveY[numMoves[0]] = y;
               numMoves[0]++;		// Increment number of moves found
             }
           }
         }
       };



       // True if the game is over, false if not over
       Board.prototype.gameOver = function()
       {

         var BMoveX = new Array(60);
         var BMoveY = new Array(60);
         var WMoveX = new Array(60);
         var WMoveY = new Array(60);
         var numBMoves = [0];
         var numWMoves = [0];

         this.getMoveList(BMoveX, BMoveY, numBMoves);
         // Temporarily flip whoseturn to opponent to get opponent move list
         this.whoseTurn = this.getOpponentPiece();
         this.getMoveList(WMoveX, WMoveY, numWMoves);
         this.whoseTurn = this.getOpponentPiece();  // Flip back to original
         if ((numBMoves[0] === 0) && (numBMoves[0] === 0))
         {	return true;    }
         return false;
       };



       // Using the move list, gets a random move out of this list
       Board.prototype.getRandomMove = function(x, y)
       {
         var moveX = new Array(60);
         var moveY = new Array(60);
         var numMoves = [0];
         this.getMoveList(moveX, moveY, numMoves);
         if (numMoves[0] === 0)
         {
           x[0] = -1;
           y[0] = -1;
         }
         else
         {
           var i = floor(random(0,1000)) % numMoves[0];
           x[0] = moveX[i];
           y[0] = moveY[i];
         }
       };


       // Returns the score for the piece
       Board.prototype.score = function(piece)
       {
         var total = 0;
         for (var x = 0; x < 8; x++)
         {
           for (var y = 0; y < 8; y++)
           {
             if (this.Tiles[x][y].face === piece)
             {

                 {   total++;    }
             }
           }
         }
         return total;
       };


       //////////////////////////////
       // Returns the score for the piece
       Board.prototype.scoreEdge = function(piece)
       {
         var total = 0;
         for (var x = 0; x < 8; x++)
         {
           for (var y = 0; y < 8; y++)
           {
             if (this.Tiles[x][y].face === piece)
             {
                 if ((x === 0 ) || (x === 7) || (y === 0) || (y === 7))
                 {
                   if ( ((x===0) && (y===0)) || ((x===0) && (y===7)) || ((x===7) && (y===0)) || ((x===7) && (y===7)) )
                   { total+= 90; }
                   else 
                   { total +=5; }
                 }
                 else
                 {   total++;    }
             }
           }
         }
         return total;
       };



       //////////////////////////////


       // The simple heuristic is simply the number of our pieces - the number of opponent pieces.
       // Weighting the edges and corners will result in a better player.
       Board.prototype.heuristic = function(whoseTurn)
       {	
         var ourScore = this.scoreEdge(whoseTurn);
         var opponent = 'B';
         if (whoseTurn === 'B')
         {	opponent = 'W'; }
         var opponentScore = this.scoreEdge(opponent);
         return (ourScore - opponentScore);
       };




       // minimaxValue makes a recursive call to itself to search another ply in the tree.
       // It is hard-coded here to look 5 ply ahead.  originalTurn is the original player piece
       // which is needed to determine if this is a MIN or a MAX move.  It is also needed to 
       // calculate the heuristic. currentTurn flips between X and O.
       function minimaxValue(board, originalTurn, searchPly,alpha,beta)
       {

         if ((searchPly === 6) || board.gameOver()) // Change to desired ply lookahead
         {
           return board.heuristic(originalTurn); // Termination criteria
         }
         var moveX = new Array(60);
         var moveY = new Array(60);
         var numMoves = [0];
         var opponent = board.getOpponentPiece();

         board.getMoveList(moveX, moveY, numMoves);
         if (numMoves[0] === 0) // if no moves skip to next player's turn
         {
           var temp = new Board(board);
           temp.setCurrentPlayer(opponent);
           return minimaxValue(temp, originalTurn, searchPly + 1);
         }
         else
         {
           // Remember the best move
           var bestMoveVal = -99999; // for finding max
           if (originalTurn !== board.getWhosePiece())
           {	bestMoveVal = 99999;    }
                                    // for finding min
                        // Try out every single move
           for (var i = 0; i < numMoves[0]; i++)
           {
             // Apply the move to a new board
             var tempBoard = new Board(board);
             tempBoard.makeMove(moveX[i], moveY[i]);
             // Recursive call
             // Opponent's turn
             tempBoard.setCurrentPlayer(tempBoard.getOpponentPiece());
             var val = minimaxValue(tempBoard, originalTurn, searchPly + 1);
             // Remember best move
             if (originalTurn === board.getWhosePiece())
             {
               // Remember max if it's the originator's turn
               if (val > bestMoveVal)
               {	bestMoveVal = val;  }
               if (bestMoveVal >= alpha)
               {	alpha = bestMoveVal;    }
               if (alpha >= beta)
               {	break;  }
             }
             else
             {
               // Remember min if it's opponent turn
               if (val < bestMoveVal)
               {	bestMoveVal = val;  }
               if (bestMoveVal <= beta)
               {	beta = bestMoveVal; }
               if (alpha >= beta)
               {   break;  }
             }
           }
           return bestMoveVal;
         }
         return -1;  // Should never get here
       }



       // This is the minimax decision function. It calls minimaxValue for each position
       // on the board and returns the best move (largest value returned) in x and y.
       function minimaxDecision(board, x, y)
       {	
         var moveX = new Array(60);
         var moveY = new Array(60);
         var numMoves = [0];
         var opponent = board.getOpponentPiece();

         board.getMoveList(moveX, moveY, numMoves);

         if (numMoves[0] === 0) // if no moves return -1
         {
           x[0] = -1;
           y[0] = -1;
         }
         else
         {

           // Remember the best move
           var bestMoveVal = -99999;
           var bestX = moveX[0];
           var bestY = moveY[0];
           // Try out every single move
           for (var i = 0; i < numMoves[0]; i++)
           {

             // Apply the move to a new board
             var tempBoard = new Board(board);
             tempBoard.makeMove(moveX[i], moveY[i]);
             // Recursive call
             // Set turn to opponent
             tempBoard.setCurrentPlayer(tempBoard.getOpponentPiece());
             var val = minimaxValue(tempBoard, board.getWhosePiece(), 1,-99999,99999);

             // Remember best move
             if (val > bestMoveVal)
             {
               bestMoveVal = val;
               bestX = moveX[i];
               bestY = moveY[i];
             }
           }
           // Return the best x/y
           x[0] = bestX;
           y[0] = bestY;
         }
       }


       var gameBoard = new Board();
       gameBoard.setCurrentPlayer('W');


       function botPlay()
       {
           var x = [0];
           var y = [0];
         minimaxDecision(gameBoard, x, y);
         if (x[0] === -1)
         {   
             gameBoard.setCurrentPlayer(gameBoard.getOpponentPiece());
             return;
         }
         gameBoard.makeMove(x[0], y[0]);
         gameBoard.setCurrentPlayer(gameBoard.getOpponentPiece());
       }

       gameScene = "start";


       function startScene()
       {
           gameBoard.draw();
           fill(255, 255, 255);
           textSize(75);
           text("OTHELLO",25,50,400,200);

           fill(255, 255, 255);
           rect(80,270,240,100);
           fill(0, 0, 0);
           rect(90,280,220,80);

           textSize(45);
           fill(255, 255, 255);
           text("PLAY",140,300,200,200);

           if (mouseX>=80 && mouseX<=320 &&
               mouseY>=270 && mouseY<=370)
               {
                   fill(0, 0, 0);
                   rect(80,270,240,100);
                   fill(255, 255, 255);
                   rect(90,280,220,80);

                   textSize(45);
                   fill(0, 0, 0);
                   text("PLAY",140,300,200,200);
               }
       }


       function choosePieceScene()
       {
           gameBoard.draw();
           //background(47, 161, 16);


           fill(255, 255, 255);
           textSize(40);
           text("Choose Piece",70,60,300,300);

           textSize(30);
           // White piece
           fill(0, 0, 0);
           rect(60,130,280,100);
           fill(255, 255, 255);
           ellipse(110,180,50,50);
           text("WHITE",180,170,100,100);

           if (mouseX>=60 && mouseX<=340 &&
               mouseY>=130 && mouseY<=230)
           {   
               fill(45, 224, 36);
               rect(60,130,280,100);
               fill(255, 255, 255);
               ellipse(110,180,50,50);
               text("WHITE",180,170,100,100);
           }

           // Black piece
           fill(255, 255, 255);
           rect(60,260,280,100);
           fill(0, 0, 0);
           ellipse(110,310,50,50);
           text("BLACK",180,300,100,100);

           if (mouseX>=60 && mouseX<=340 &&
               mouseY>=260 && mouseY<=360)
           {   
               fill(45, 224, 36);
               rect(60,260,280,100);
               fill(0, 0, 0);
               ellipse(110,310,50,50);
               text("BLACK",180,300,100,100);
           }

       }

       function onePlayerScene()
       {
           stroke(0, 0, 0);
           gameBoard.draw();
           if (gameBoard.whoseTurn !== playerPiece)
           {   botPlay();  }

           for (var i = 0; i < BOARD_SIZE; i++)
           {
               for (var j = 0; j < BOARD_SIZE; j++)
               {
                  if (gameBoard.Tiles[i][j].isUnderMouse(mouseX,mouseY) &&
                      gameBoard.Tiles[i][j].face === "E")
                      {
                           fill(121, 240, 88);
                           rect(gameBoard.Tiles[i][j].x,
                                gameBoard.Tiles[i][j].y-TILE_EDGE,
                                TILE_EDGE,TILE_EDGE);
                      }
               }
           }

           if (gameBoard.gameOver())
           {
               gameBoard.setCurrentPlayer(gameBoard.getOpponentPiece());
               if (gameBoard.gameOver())
               {
                   gameBoard.draw();
                   gameScene = "gameOver";
               }
           }
       }

       function gameOverScene()
       {
           //background(255, 255, 255);
           fill(45, 224, 36);
           rect(60,50,275,320,10);
           fill(255, 0, 0);
           textSize(40);

           var opponent = "W";
           if (playerPiece === "W")
           { opponent = "B"; }


           if (gameBoard.score(playerPiece) > gameBoard.score(opponent))
           {
               text("YOU WIN",110,80,300,300);
           }
           else if (gameBoard.score(playerPiece) < gameBoard.score(opponent))
           {
               text("YOU LOSE",90,80,300,300);
           }
           else 
           {
               text("DRAW",140,80,300,300);
           }


           textSize(30);
           fill(255, 255, 255);
           text("White = "+gameBoard.score("W"),120,140,200,200);
           fill(0, 0, 0);
           text("Black = "+gameBoard.score("B"),120,190,200,200);
           if (mouseX>=100 && mouseX<=300 &&
               mouseY>=240 && mouseY<=340)
           {
               fill(0, 0, 0);
               rect(100,240,200,100);
               fill(255, 255, 255);
               rect(110,250,180,80);
               fill(0, 0, 0);
               text("AGAIN",150,280,100,100);
           }
           else{
               fill(255, 255, 255);
               rect(100,240,200,100);
               fill(0, 0, 0);
               rect(110,250,180,80);
               fill(255,255,255);
               text("AGAIN",150,280,100,100);
           }
       }


       mouseClicked = function()
       {
           if (gameScene === "start")
           {
               if (mouseX>=80 && mouseX<=320 &&
                   mouseY>=270 && mouseY<=370)
               {
                   gameScene = "choosePiece";
               }
           }
           else if (gameScene === "choosePiece")
           {
               if (mouseX>=60 && mouseX<=340 &&
               mouseY>=130 && mouseY<=230)
               {   
                   playerPiece = "W";
                   gameScene = "onePlayer";
               }


               if (mouseX>=60 && mouseX<=340 &&
                   mouseY>=260 && mouseY<=360)
               {
                   playerPiece = "B";
                   gameScene = "onePlayer";
               }
           }   
           else if (gameScene === "onePlayer")
           {
               if (gameBoard.getWhosePiece() === playerPiece)
               {
                   for (var i = 0; i < BOARD_SIZE; i++)
                   {
                       for (var j = 0; j < BOARD_SIZE; j++)
                       {
                          if (gameBoard.Tiles[i][j].isUnderMouse(mouseX,mouseY) && 
                               gameBoard.validMove(i, j))
                               {
                                   gameBoard.makeMove(i, j);
                                   gameBoard.setCurrentPlayer(gameBoard.getOpponentPiece());
                                   gameBoard.draw();
                               }
                           if (gameBoard.Tiles[i][j].isUnderMouse(mouseX,mouseY) && 
                               !gameBoard.validMove(i, j)) 
                               {
                                  // println(i+","+j);
                               }
                       }
                   }
               }
           }
           else if (gameScene === "gameOver") 
           {
              if (mouseX>=100 && mouseX<=300 &&
               mouseY>=240 && mouseY<=340)
               {
                   gameBoard = new Board();
                   gameBoard.setCurrentPlayer('W');
                   gameScene = "choosePiece";
               }  
           }
       };



       draw = function() {
           if (gameScene === "start")
           {   startScene();   }
           else if (gameScene === "choosePiece")
           {   choosePieceScene(); }
           else if (gameScene === "onePlayer")
           {   onePlayerScene(); }
           else if (gameScene === "gameOver")
           {   gameOverScene();    }
       };

   }};

   // Get the canvas that Processing-js will use
   var canvas = document.getElementById("mycanvas"); 
   // Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
   var processingInstance = new Processing(canvas, sketchProc); 