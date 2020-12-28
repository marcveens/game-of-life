import { Component, Fragment, h, State } from '@stencil/core';
import { Cell, GameOfLife as GameOfLifeMachine } from './GameOfLife';

@Component({
    tag: 'game-of-life'
})
export class GameOfLife {
    @State() playing: boolean;
    @State() playSpeed: number = 400;

    private ctx: CanvasRenderingContext2D;
    private machine: GameOfLifeMachine;
    private playInterval: NodeJS.Timeout;

    private width = 800;
    private height = 800;
    private cellSize = 20;
    private pixelShifter = .5; // http://diveintohtml5.info/canvas.html
    private doublePixelShifter = this.pixelShifter * 2;
    private strokeColor = '#666';
    private cellColor = '#F00';

    componentDidLoad() {
        this.machine = new GameOfLifeMachine();
        this.drawGrid();
        this.drawCells(this.machine.getLivingCells());
    }

    disconnectedCallback() {
        clearInterval(this.playInterval);
    }

    drawGrid() {
        const canvas = document.getElementById('grid') as HTMLCanvasElement;
        this.ctx = canvas.getContext('2d');
        canvas.width = this.width + this.doublePixelShifter;
        canvas.height = this.height + this.doublePixelShifter;

        this.drawHorizontalRules();
        this.drawVerticalRules();

    }

    drawCells(cells: Cell[]) {
        cells.forEach(cell => {
            const x = (cell.x * this.cellSize) + this.doublePixelShifter;
            const y = (cell.y * this.cellSize) + this.doublePixelShifter;
            const cellSize = this.cellSize - this.doublePixelShifter;

            this.ctx.fillStyle = this.cellColor;
            this.ctx.fillRect(x, y, cellSize, cellSize);
        });
    }

    drawHorizontalRules() {
        this.ctx.beginPath();
        for (let y = 0; y <= this.height; y += this.cellSize) {
            this.ctx.moveTo(0, y + this.pixelShifter);
            this.ctx.lineTo(this.width, y + this.pixelShifter);
        }
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }

    drawVerticalRules() {
        this.ctx.beginPath();
        for (let x = 0; x <= this.width; x += this.cellSize) {
            this.ctx.moveTo(x + this.pixelShifter, 0);
            this.ctx.lineTo(x + this.pixelShifter, this.height);
        }
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }

    nextStep() {
        this.machine.nextStep();
        this.clearGrid();
        this.drawCells(this.machine.getLivingCells());
    }

    play() {
        this.playing = !this.playing;
        this.playInterval = setInterval(() => {
            this.nextStep();
        }, this.playSpeed);
    }

    pause() {
        this.playing = !this.playing;
        clearInterval(this.playInterval);
    }

    clearGrid() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawGrid();
    }

    render() {
        return (
            <Fragment>
                <canvas id="grid" />
                <div>
                    {this.playing ? (
                        <button onClick={() => this.pause()}>Pause</button>
                    ) : (
                        <button onClick={() => this.play()}>Play</button>
                    )}
                    <button onClick={() => this.nextStep()} disabled={this.playing}>Next step</button>
                    <button onClick={() => this.clearGrid()} disabled={this.playing}>Clear</button>
                </div>
            </Fragment>
        );
    }
}