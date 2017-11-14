import * as React from 'react';
import { ISectionData } from '../../../src-feed-reader/interfaces';

function spaceDelimitedStringsOrNull(...theStrings: (string | number)[]) {
    return theStrings.filter(aString => aString).join(' ') || null;
}

export const ItemTemplate: React.SFC<ISectionData> = data => {
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
                    <a key="show-image" href={data.url} className="show-image"><svg className="icon"><use xlinkHref="#icon_arrow" /></svg></a>,
                    <div key="thumbnail" data-thumbnail={data.thumbnail} className="thumbnail tooltip-holder"></div>,
                    <div key="full-image" className="full-image"></div>
                ]
                : null }
        </li>
    );
};
