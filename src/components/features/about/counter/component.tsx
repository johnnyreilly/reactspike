import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { CounterStore } from '../../../../dependencies/stores/counterStore';
import { Dependencies } from '../../../../dependencies';

export interface ICounterProps {
    counterStore: CounterStore;
}

@inject(
    (dependencies: Dependencies) => ({
        counterStore: dependencies.counterStore
    }) as ICounterProps
)
@observer
export class Counter extends React.Component<Partial<ICounterProps>> {
    handleIncrement = () => {
        this.props.counterStore.increment();
    }

    render() {
        const { count } = this.props.counterStore;
        return (
            <div>
                The count is: {count}

                <button onClick={this.handleIncrement}>Increment counter</button>
            </div>
        );
    }
}
