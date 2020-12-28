export type Cell = {
    x: number;
    y: number;
};

export class GameOfLife {
    private livingCells: Cell[] = [
        {
            x: 10,
            y: 10
        },
        {
            x: 11,
            y: 10
        },
        {
            x: 12,
            y: 10
        },
        {
            x: 10,
            y: 11
        },
        {
            x: 12,
            y: 11
        },
        {
            x: 10,
            y: 12
        },
        {
            x: 11,
            y: 12
        },
        {
            x: 12,
            y: 12
        },
        {
            x: 10,
            y: 13
        },
        {
            x: 11,
            y: 13
        },
        {
            x: 12,
            y: 13
        },
        {
            x: 10,
            y: 14
        },
        {
            x: 11,
            y: 14
        },
        {
            x: 12,
            y: 14
        },
        {
            x: 10,
            y: 15
        },
        {
            x: 11,
            y: 15
        },
        {
            x: 12,
            y: 15
        },
        {
            x: 10,
            y: 16
        },
        {
            x: 12,
            y: 16
        },
        {
            x: 10,
            y: 17
        },
        {
            x: 11,
            y: 17
        },
        {
            x: 12,
            y: 17
        }
    ];

    public setCells(cells: Cell[]) {
        this.livingCells = cells;
    }

    public getLivingCells() {
        return this.livingCells;
    }

    public nextStep() {
        const livingCells: Cell[] = [];

        this.getLivingCellsAndNeighbours().forEach(cell => {
            const livingNeighbours = this.getLivingNeighbours(cell);
            const isAlreadyLivingCell = livingCells.some(l => cell.x === l.x && cell.y === l.y);
            if (this.shouldCellBeAlive(cell, livingNeighbours) && !isAlreadyLivingCell) {
                livingCells.push(cell);
            }
        });

        this.setCells(livingCells);
    }

    private getLivingNeighbours(cell: Cell) {
        return this.getNeighbours(cell)
            .filter(c => this.getLivingCells().some(l => c.x === l.x && c.y === l.y))
            // Filter out own cell
            .filter(c => !(c.x === cell.x && c.y === cell.y));
    }

    private getNeighbours(cell: Cell) {
        const neighbours: Cell[] = [];

        for (let i = cell.x - 1; i <= cell.x + 1; i++) {
            for (let j = cell.y - 1; j <= cell.y + 1; j++) {
                neighbours.push({
                    x: i,
                    y: j
                });
            }
        }

        return neighbours;
    }

    private getLivingCellsAndNeighbours() {
        let cells: Cell[] = [];

        this.getLivingCells().forEach(cell => {
            cells = cells.concat(this.getNeighbours(cell));
        });

        return cells;
    }

    private shouldCellBeAlive(cell: Cell, livingNeighbours: Cell[]) {
        const isCellAlive = this.getLivingCells().some(l => cell.x === l.x && cell.y === l.y);
        const isAliveAndHas2Or3LivingNeighbours = isCellAlive && (livingNeighbours.length === 2 || livingNeighbours.length === 3);
        const isDeadAndHas3LivingNeighbours = !isCellAlive && livingNeighbours.length === 3;

        return isAliveAndHas2Or3LivingNeighbours || isDeadAndHas3LivingNeighbours;
    }
}