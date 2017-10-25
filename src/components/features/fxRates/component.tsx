import * as React from 'react';
import { inject, observer } from 'mobx-react';
import * as classNames from 'classnames';
import { FxRatesStore } from '../../../dependencies/stores/fxRatesStore';
import { Dependencies } from '../../../dependencies';
import { Rates } from './rates';

export interface IFxRatesProps {
    fxRatesStore: FxRatesStore;
}

interface IState {
    date: string;
}

@inject(
    (dependencies: Dependencies) => ({
        fxRatesStore: dependencies.fxRatesStore
    }) as IFxRatesProps
)
@observer
export class FxRatesPage extends React.Component<Partial<IFxRatesProps>, IState> {
    state = {
        date: '2012-06-15'
    } as IState;

    handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { value: date } } = event;
        this.setState(_prevState => ({ date }));
    }

    handleLoadForDateClick = (_event: React.MouseEvent<HTMLButtonElement>) => {
        this.props.fxRatesStore.loadRatesForDate(this.state.date);
    }

    handleLoadLatestClick = (_event: React.MouseEvent<HTMLButtonElement>) => {
        this.props.fxRatesStore.loadRates();
    }

    render() {
        const { date } = this.state;
        const { rates, ratesForDate, lastLoaded } = this.props.fxRatesStore;
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
                        isSuccess: !ratesForDate.error,
                        isDanger: !!ratesForDate.error,
                        isLoading: ratesForDate.isRequesting
                    })}
                    onClick={this.handleLoadForDateClick}
                >
                    Load 'em up for given date
                </button>

                <button
                    className={classNames({
                        button: true,
                        isSuccess: !rates.error,
                        isDanger: !!rates.error,
                        isLoading: rates.isRequesting
                    })}
                    onClick={this.handleLoadLatestClick}
                >
                    Load latest
                </button>

                <p>Last loaded: {lastLoaded === 'ratesForDate' ? 'Rates for date' : lastLoaded === 'rates' ? 'Latest Rates' : null}</p>

                {lastLoaded === 'ratesForDate' ? <Rates {...ratesForDate} /> : null}
                {lastLoaded === 'rates' ? <Rates {...rates} /> : null}
            </div>
        );
    }
}