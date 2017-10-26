import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { SpikePage, IConfig } from '../../shared/spike';

// const spikeName        = 'Readspike';
const spikeShortName   = 'world';
// const spikeTitle       = 'Simple news aggregator';
// const spikeDescription = 'Aggregating the news from around the web every minute';
// const spikeHeaderBG    = '#fff';
// const spikeBodyBG      = '#1a1c20';
// const spikeURl         = 'https://readspike.com/';
// const spikePath        = __DIR__ ;

const config: IConfig[] = [
  {
    'name'  : 'Reddit',
    'title' : 'Reddit World News',
    'type'  : 'json',
    'color' : '#ff4e00',
    'col'   : '3',
    'row'   : '0',
    'mob'   : '0',
    'url'   : 'https://www.reddit.com/r/worldnews/',
    'feed'  : 'https://www.reddit.com/r/worldnews/.json?limit=100',
    },
    {
    'name'  : 'BBCWorld',
    'title' : 'BBC World News',
    'type'  : 'xml',
    'color' : '#a91717',
    'col'   : '1',
    'row'   : '0',
    'mob'   : '2',
    'url'   : 'http://www.bbc.co.uk/news/world',
    'feed'  : 'http://feeds.bbci.co.uk/news/world/rss.xml',
    },
    {
    'name'  : 'theguardian',
    'title' : 'The Guardian',
    'type'  : 'xml',
    'color' : '#005689',
    'col'   : '1',
    'row'   : '1',
    'mob'   : '3',
    'url'   : 'http://www.theguardian.com/',
    'feed'  : 'https://www.theguardian.com/international/rss',
    },
    {
    'name'  : 'Google',
    'title' : 'Google News',
    'type'  : 'xml',
    'color' : '#dd4b39',
    'col'   : '2',
    'row'   : '0',
    'mob'   : '1',
    'url'   : 'https://news.google.com/',
    'feed'  : 'https://news.google.com/news?cf=all&hl=en&pz=1&ned=uk&topic=w&output=rss',
    },
    {
    'name'  : 'Economist',
    'title' : 'The Economist',
    'type'  : 'xml',
    'color' : '#E3120B',
    'col'   : '1',
    'row'   : '4',
    'mob'   : '6',
    'url'   : 'http://www.economist.com/',
    'feed'  : 'http://www.economist.com/sections/international/rss.xml',
    },
    {
    'name'  : 'Reuters',
    'title' : 'Reuters',
    'type'  : 'xml',
    'color' : '#ff8000',
    'col'   : '2',
    'row'   : '2',
    'mob'   : '4',
    'url'   : 'http://www.reuters.com/',
    'feed'  : 'http://feeds.reuters.com/reuters/topNews',
    },
    {
    'name'  : 'CNN',
    'title' : 'CNN',
    'type'  : 'xml',
    'color' : '#ca0002',
    'col'   : '3',
    'row'   : '1',
    'mob'   : '6',
    'url'   : 'http://edition.cnn.com/',
    'feed'  : 'http://rss.cnn.com/rss/edition.rss',
    },
    {
    'name'  : 'aljazeera',
    'title' : 'Al Jazeera',
    'type'  : 'xml',
    'color' : '#fa9000',
    'col'   : '2',
    'row'   : '3',
    'mob'   : '5',
    'url'   : 'http://www.aljazeera.com/',
    'feed'  : 'http://www.aljazeera.com/xml/rss/all.xml',
    },
    {
    'name'  : 'abcnews',
    'title' : 'ABC News',
    'type'  : 'xml',
    'color' : '#3467b0',
    'col'   : '3',
    'row'   : '2',
    'mob'   : '6',
    'url'   : 'http://abcnews.go.com/',
    'feed'  : 'http://feeds.abcnews.com/abcnews/topstories',
    },
    {
    'name'  : 'independent',
    'title' : 'The Independent',
    'type'  : 'xml',
    'color' : '#ec1a2e',
    'col'   : '1',
    'row'   : '3',
    'mob'   : '6',
    'url'   : 'http://www.independent.co.uk/',
    'feed'  : 'http://www.independent.co.uk/news/world/rss',
    },
    {
    'name'  : 'vice',
    'title' : 'Vice News',
    'type'  : 'xml',
    'color' : '#837c7d',
    'col'   : '3',
    'row'   : '1',
    'mob'   : '6',
    'url'   : 'https://news.vice.com/',
    'feed'  : 'https://news.vice.com/feed',
    }
];

export const WorldPage: React.SFC<RouteComponentProps<{}>> = _props => (
  <SpikePage spikeShortName={spikeShortName} config={config} />
);