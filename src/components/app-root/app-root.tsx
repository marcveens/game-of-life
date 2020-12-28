import { Component, h } from '@stencil/core';

@Component({
    tag: 'app-root'
})
export class AppRoot {
    render() {
        return (
            <div>
                <main>
                    <game-of-life />
                </main>
            </div>
        );
    }
}