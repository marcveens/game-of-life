import { Cell, GameOfLife } from '../GameOfLife';

describe('GameOfLife', () => {
    describe('Blinker oscillator', () => {
        const machine = new GameOfLife();
        const stateA: Cell[] = [
            {
                x: 3,
                y: 2
            },
            {
                x: 3,
                y: 3
            },
            {
                x: 3,
                y: 4
            }
        ];
        
        const stateB: Cell[] = [
            {
                x: 2,
                y: 3
            },
            {
                x: 3,
                y: 3
            },
            {
                x: 4,
                y: 3
            }
        ];

        let lastState: Cell[] = [];

        it('should be in state B after nextStep of state A', () => {
            // arrange
            machine.setCells(stateA);

            // act
            machine.nextStep();
            lastState = machine.getLivingCells();

            // assert
            expect(lastState).toStrictEqual(stateB);
        });

        it('should be in state A after nextStep of lastState', () => {
            // arrange + act
            machine.nextStep();
            lastState = machine.getLivingCells();

            // assert
            expect(lastState).toStrictEqual(stateA);
        });
    });
});