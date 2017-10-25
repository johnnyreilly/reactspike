import * as React from 'react';
import { Provider } from 'mobx-react';
import * as renderer from 'react-test-renderer';
import { Counter } from '../component';

function makeStubCounterStore() {
    const stubCounterStore = {
        count: 0,
        increment() {
            this.count += 1;
        }
    };
    return stubCounterStore;
}

describe('counter', () => {
    it('component renders as expected', () => {
        const stubCounterStore = makeStubCounterStore();
        const component = renderer.create(
            <Provider counterStore={stubCounterStore}>
                <Counter />
            </Provider>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});