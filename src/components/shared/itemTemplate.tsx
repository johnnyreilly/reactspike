import * as React from 'react';
import { ISectionData } from '../../../src-feed-reader/interfaces';

function spaceDelimitedStringsOrNull(...theStrings: (string | number)[]) {
    return theStrings.filter(aString => aString).join(' ') || null;
}

interface IState {
    hasHovered: boolean;
}

export class ItemTemplate extends React.Component<ISectionData, IState> {
    state = { hasHovered: false } as IState;

    onHover = (_event: React.MouseEvent<HTMLAnchorElement>) =>
        this.setState(_prevState => ({ hasHovered: true }))

    render() {
        const data = this.props;
        if (data.stickied) {
            return null;
        }

        return (
            <li key={data.url} className={spaceDelimitedStringsOrNull(data.postHint, data.over18 ? 'nsfw' : '')}>
                <a
                    href={data.url}
                    className="story-title"
                    data-title={spaceDelimitedStringsOrNull(data.selftext, data.subreddit, data.ups)}
                >
                    {data.title}
                </a>
                {data.comments
                    ? <a href={data.comments} className="comments" title="Comments">
                        <svg className="icon"><use xlinkHref="#icon_comment" /></svg>
                    </a>
                    : null}
                {data.postHint === 'image'
                    ? [
                        <a key="hide-image" className="hide-image"><svg className="icon"><use xlinkHref="#icon_x" /></svg></a>,
                        <a key="show-image" href={data.url} className="show-image" onMouseOver={this.onHover}>
                            <svg className="icon">
                                <use xlinkHref="#icon_arrow" />
                            </svg>
                        </a>,
                        <div
                            key="thumbnail"
                            style={this.state.hasHovered
                                ? { backgroundImage: `url(${data.thumbnail})` }
                                : null}
                            className="thumbnail tooltip-holder"
                        >
                        </div>,
                        <div key="full-image" className="full-image"></div>
                    ]
                    : null}
            </li>
        );
    }
}
