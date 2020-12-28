import { Component, Fragment, h, State } from '@stencil/core';
import { Environment } from '../../utils/Environment';
import { GameOfLife as GameOfLifeMachine } from './GameOfLife';
import pentadecathlonDemo from './demos/pentadecathlon.json';
import gosperGliderGunDemo from './demos/gosper-glider-gun.json';

@Component({
    tag: 'game-of-life'
})
export class GameOfLife {
    @State() playing: boolean;
    @State() playSpeed: number = 100;
    @State() iterations: number = 0;
    @State() visibilityChanged: boolean = false;
    // Only added for updating the JSON input after manually adding cells on a development environment
    @State() tick: number = 0;

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private machine: GameOfLifeMachine;
    private playInterval: NodeJS.Timeout;

    private width = 800;
    private height = 800;
    private cellSize = 20;
    private pixelShifter = .5; // http://diveintohtml5.info/canvas.html
    private doublePixelShifter = this.pixelShifter * 2;
    private strokeColor = '#444';
    private cellColor = '#F00';

    componentDidLoad() {
        this.canvas = document.getElementById('grid') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.width + this.doublePixelShifter;
        this.canvas.height = this.height + this.doublePixelShifter;

        this.machine = new GameOfLifeMachine();
        this.redrawGrid();

        this.canvas.addEventListener('mousedown', this.onCanvasClick.bind(this));
        window.addEventListener('visibilitychange', this.onVisibilityChange.bind(this));
    }

    disconnectedCallback() {
        clearInterval(this.playInterval);

        this.canvas.removeEventListener('mousedown', this.onCanvasClick.bind(this));
        window.removeEventListener('visibilitychange', this.onVisibilityChange.bind(this));
    }

    onVisibilityChange() {
        if (document.visibilityState === 'hidden') {
            this.pause();
        }
    }

    drawGrid() {
        this.drawHorizontalRules();
        this.drawVerticalRules();
    }

    drawCells() {
        this.machine.getLivingCells().forEach(cell => {
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
        this.redrawGrid();
        this.iterations = this.iterations + 1;
    }

    play() {
        this.playing = true;
        this.playInterval = setInterval(() => {
            this.nextStep();
        }, this.playSpeed);
    }

    pause() {
        this.playing = false;
        clearInterval(this.playInterval);
    }

    redrawGrid() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawGrid();
        this.drawCells();

        this.tick = this.tick + 1;
    }

    clearGrid() {
        clearInterval(this.playInterval);
        this.iterations = 0;
        this.machine.setCells([]);
        this.redrawGrid();
    }

    onCanvasClick(e: MouseEvent) {
        const currX = e.clientX - this.canvas.offsetLeft;
        const currY = e.clientY - this.canvas.offsetTop;
        const x = Math.floor(currX / this.cellSize);
        const y = Math.floor(currY / this.cellSize);

        this.machine.toggleCell({ x, y });
        this.redrawGrid();
    }

    setDemo(version: number) {
        this.clearGrid();
        
        switch (version) {
            case 1:
                this.machine.setCells(pentadecathlonDemo);
                break;
            case 2:
                this.machine.setCells(gosperGliderGunDemo);
                break;
        }

        this.redrawGrid();
    }

    render() {
        const livingCells = this.machine ? this.machine.getLivingCells() : [];

        return (
            <Fragment>
                <div>
                    {this.playing ? (
                        <button onClick={() => this.pause()}>Pause</button>
                    ) : (
                            <button onClick={() => this.play()}>Play</button>
                        )}
                    <button onClick={() => this.nextStep()} disabled={this.playing}>Next step</button>
                    <button onClick={() => this.clearGrid()} disabled={this.playing}>Clear</button>
                    <span>&nbsp;&nbsp;Iterations: {this.iterations}</span>
                    <div>
                        <button onClick={() => this.setDemo(1)} disabled={this.playing}>Demo 1</button>
                        <button onClick={() => this.setDemo(2)} disabled={this.playing}>Demo 2</button>
                    </div>
                    {Environment.isDevelopment && (
                        <div>
                            <input type="text" value={JSON.stringify(livingCells)} readOnly={true} />
                        </div>
                    )}
                </div>
                <br />
                <canvas id="grid" />
            </Fragment>
        );
    }
}