import * as React from 'react';
import { inject, observer } from 'mobx-react';
import * as classNames from 'classnames';
import { HourStore } from '../../../dependencies/stores/hourStore';
import { Dependencies } from '../../../dependencies';

export interface IDataProps {
    hourStore: HourStore;
}

interface IState {
    date: string;
}

@inject(
    (dependencies: Dependencies) => ({
        hourStore: dependencies.hourStore
    }) as IDataProps
)
@observer
export class DataPage extends React.Component<Partial<IDataProps>, IState> {
    state = {
        date: '2012-06-15'
    } as IState;

    handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { value: date } } = event;
        this.setState(_prevState => ({ date }));
    }

    handleLoadClick = (_event: React.MouseEvent<HTMLButtonElement>) => {
        this.props.hourStore.load();
    }

    handleSaveClick = (_event: React.MouseEvent<HTMLButtonElement>) => {
        this.props.hourStore.save();
    }

    render() {
        const { date } = this.state;
        const { lastSavedAt } = this.props.hourStore;
        return (
            <div>
                <div className="field">
                    <label className="label">Date</label>
                    <div className="control">
                        <input className="input" type="text" value={date} onChange={this.handleDateChange} />
                    </div>
                </div>

                <button
                    className={classNames({
                        button: true,
                        isPrimary: true
                    })}
                    onClick={this.handleLoadClick}
                >
                    Load data
                </button>

                <button
                    className={classNames({
                        button: true,
                        isPrimary: true
                    })}
                    onClick={this.handleSaveClick}
                >
                    Save data
                </button>

                <p>lastSavedAt: {lastSavedAt}</p>

            </div>
        );
    }
}