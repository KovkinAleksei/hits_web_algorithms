
class Ant {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.direction = 'up';
    this.color = 'black';
  }
  
  turnLeft() {
    switch (this.direction) {
      case 'up':
        this.direction = 'left';
        break;
      case 'down':
        this.direction = 'right';
        break;
      case 'left':
        this.direction = 'down';
        break;
      case 'right':
        this.direction = 'up';
        break;
    }
  }

  turnRight() {
    switch (this.direction) {
      case 'up':
        this.direction = 'right';
        break;
      case 'down':
        this.direction = 'left';
        break;
      case 'left':
        this.direction = 'up';
        break;
      case 'right':
        this.direction = 'down';
        break;
      }
  }

  moveForward() {
    switch (this.direction) {
      case 'up':
        this.y--;
        break;
      case 'down':
        this.y++;
        break;
      case 'left':
        this.x--;
        break;
      case 'right':
        this.x++;
        break;
      }
  }


    changeColor(newColor) {
      this.color = newColor;
    }
}