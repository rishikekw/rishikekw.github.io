import p5 from 'p5';

new p5((p5: p5) => {
  let steps = 0.0;

  const normalizeRange = (min, max) => {
    var divisor = max - min;

    return function (value) {
      return (value - min) / divisor;
    };
  };

  const findColor = (first, second, step, normalize?: (number) => number) => {
    if (normalize) return p5.lerpColor(first, second, normalize(step));
    return p5.lerpColor(first, second, step);
  };

  p5.setup = () => {
    var canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
    canvas.parent("squares");
  };

  p5.draw = () => {
    p5.clear();

    steps += 0.0005;
    var FIRST = p5.color(49, 121, 237);
    var SECOND = p5.color(44, 204, 76);

    var squareDimension = Math.min(
      window.innerWidth / 20,
      window.innerHeight / 20
    );

    var space = squareDimension / 5;
    var gridWidth = window.innerWidth / squareDimension / 1.3;
    var gridMaxHeight = window.innerHeight / squareDimension / 1.5;

    var normalizeHeight = normalizeRange(0, gridMaxHeight);
    var normalizeWidth = normalizeRange(0, gridWidth);
    var normalizeMouseX = normalizeRange(0, window.innerWidth);
    var normalizeMouseY = normalizeRange(0, window.innerHeight);
    var offset = squareDimension + space;

    const getRandomXY = (x, y) => {
      let nx = ((p5.noise(x, steps) * window.innerWidth) % window.innerWidth) + window.innerWidth / 3;
      let ny = ((p5.noise(steps, y) * window.innerHeight) % window.innerHeight) + window.innerHeight / 3;

      // strokeWeight(1);
      // line(nx, 0, nx, height);
      // line(0, ny, width, ny);
      // strokeWeight(0);

      return [nx, ny];
    };

    const flashes: number[][] = Array.from(Array(30).keys()).map((a) => getRandomXY(a, a));

    p5.stroke(255, 255, 255);
    p5.strokeWeight(1);
    for (var x = 0; x < gridWidth; x++) {
      var horizontalOffset = offset * (x + 1);
      for (var y = 0; y < gridMaxHeight; y++) {
        var verticalOffset = offset * (y + 1);

        const rectX = window.innerWidth - horizontalOffset;
        const rectX2 = window.innerWidth - horizontalOffset + squareDimension;
        const rectY = window.innerHeight - verticalOffset;
        const rectY2 = window.innerHeight - verticalOffset + squareDimension;

        const inBounds = ([xx, yy]: number[]) =>
          xx > rectX && xx < rectX2 && yy > rectY && yy < rectY2;

        const gradientColor = findColor(
          findColor(
            FIRST,
            SECOND,
            (x + p5.noise(x, y) * 2 + normalizeMouseX(p5.pmouseX) * 3) *
              (1 + p5.noise(0, steps)),
            normalizeWidth
          ),
          findColor(
            FIRST,
            SECOND,
            (y + normalizeMouseY(p5.pmouseY)) * (1 + p5.noise(steps, 0)),
            normalizeHeight
          ),
          0.5
        );

        const inverseColor = findColor(
          findColor(
            SECOND,
            FIRST,
            (y + normalizeMouseY(p5.pmouseY)) * (1 + p5.noise(steps, 0)),
            normalizeHeight
          ),
          findColor(
            SECOND,
            FIRST,
            (x + p5.noise(x, y) * 2 + normalizeMouseX(p5.pmouseX) * 3) *
              (1 + p5.noise(0, steps)),
            normalizeWidth
          ),
          0.5
        );

        let squareColor;
        if (flashes.some((c) => inBounds(c))) squareColor = inverseColor
        else squareColor = gradientColor

        p5.fill(squareColor);
        p5.rect(
          rectX,
          rectY,
          squareDimension,
          squareDimension,
          squareDimension / 4
        );
      }

      if (p5.noise(x, y) <= 0.4) gridMaxHeight -= 1;
      if (x >= p5.floor(gridWidth * 0.5)) gridMaxHeight -= 1;
    }
  };

  p5.mouseMoved = () => {
    p5.redraw();
  }

  p5.windowResized = () => {
    p5.resizeCanvas(window.innerWidth, window.innerHeight);
  }

});
