import { ISpikeProps } from '../../shared/spike';

export const spikeConfig: ISpikeProps = {
    spikeName: 'Readspike',
    spikeShortName: '',
    spikeTitle: 'Simple news aggregator',
    spikeDescription: 'Aggregating the news from around the web every minute',
    spikeHeaderBG: '#fff',
    spikeBodyBG: '#1a1c20',
    spikeUrl: 'https://readspike.com/',
    // const spikePath        = __DIR__ ;
    sectionConfig: [
        {
            'name': 'ArsTechnica',
            'title': 'Ars Technica',
            'type': 'xml',
            'color': '#ff4e00',
            'col': '2',
            'row': '1',
            'mob': '5',
            'url': 'http://arstechnica.com/',
            'feed': 'http://feeds.arstechnica.com/arstechnica/index/'
        },
        {
            'name': 'BBC',
            'title': 'BBC',
            'type': 'xml',
            'color': '#a91717',
            'col': '1',
            'row': '0',
            'mob': '3',
            'url': 'http://www.bbc.com/news',
            'feed': 'https://feeds.bbci.co.uk/news/rss.xml?edition=uk'
        },
        {
            'name': 'Bitcoin',
            'title': 'Bitcoin',
            'type': 'json',
            'color': '#f1c40f',
            'col': '1',
            'row': '1',
            'mob': '4',
            'url': 'http://www.coindesk.com/price/',
            'feed': 'https://api.coindesk.com/v2/bpi/currentprice.json'
        },
        {
            'name': 'CNET',
            'title': 'CNET',
            'type': 'xml',
            'color': '#AA1801',
            'col': '2',
            'row': '6',
            'mob': '15',
            'url': 'https://www.cnet.com',
            'feed': 'https://www.cnet.com/rss/all/'
        },
        {
            'name': 'BoingBoing',
            'title': 'BoingBoing',
            'type': 'xml',
            'color': '#e00',
            'col': '2',
            'row': '5',
            'mob': '8',
            'url': 'http://boingboing.net/',
            'feed': 'https://boingboing.net/feed'
        },
        {
            'name': 'Core77',
            'title': 'Core77',
            'type': 'xml',
            'col': '2',
            'row': '5',
            'mob': '21',
            'color': '#eee',
            'url': 'http://www.core77.com/',
            'feed': 'http://feeds.feedburner.com/core77/blog'
        },
        {
            'name': 'Digg',
            'title': 'Digg',
            'type': 'xml',
            'color': '#666',
            'col': '2',
            'row': '3',
            'mob': '10',
            'url': 'https://digg.com/',
            'feed': 'https://digg.com/rss/top.rss'
        },
        {
            'name': 'Engadget',
            'title': 'Engadget',
            'type': 'xml',
            'color': '#9a58b5',
            'col': '1',
            'row': '2',
            'mob': '11',
            'url': 'https://engadget.com/',
            'feed': 'https://www.engadget.com/rss.xml'
        },
        {
            'name': 'HackerNews',
            'title': 'Hacker News',
            'type': 'xml',
            'color': '#FF6600',
            'col': '2',
            'row': '0',
            'mob': '2',
            'url': 'https://news.ycombinator.com/',
            'feed': 'https://news.ycombinator.com/rss'
        },
        {
            'name': 'LifeHacker',
            'title': 'LifeHacker',
            'type': 'xml',
            'color': '#94B330',
            'col': '3',
            'row': '3',
            'mob': '12',
            'url': 'http://lifehacker.com/',
            'feed': 'https://lifehacker.com/rss'
        },
        {
            'name': 'NewScientist',
            'title': 'New Scientist',
            'type': 'xml',
            'color': '#1e2e31',
            'col': '2',
            'row': '4',
            'mob': '12',
            'url': 'https://www.newscientist.com/',
            'feed': 'http://feeds.newscientist.com/science-news'
        },
        {
            'name': 'Pinboard',
            'title': 'Pinboard',
            'type': 'json',
            'color': '#5a80f2',
            'col': '1',
            'row': '2',
            'mob': '7',
            'url': 'https://www.pinboard.in/popular/',
            'feed': 'https://feeds.pinboard.in/json/popular/'
        },
        {
            'name': 'Quora',
            'title': 'Quora',
            'type': 'xml',
            'color': '#b92b27',
            'col': '8',
            'row': '2',
            'mob': '23',
            'url': 'https://www.quora.com/',
            'feed': 'https://www.quora.com/rss'
        },
        {
            'name': 'Reddit',
            'title': 'Reddit',
            'type': 'json',
            'color': '#ff4500',
            'col': '3',
            'row': '0',
            'mob': '1',
            'url': 'https://www.reddit.com/',
            'feed': 'https://www.reddit.com/.json?limit=100'
        },
        {
            'name': 'SmashingMagazine',
            'title': 'Smashing Magazine',
            'type': 'xml',
            'color': '#E43B2C',
            'col': '1',
            'row': '4',
            'mob': '13',
            'url': 'https://smashingmagazine.com/',
            'feed': 'http://www.smashingmagazine.com/feed/'
        },
        {
            'name': 'Slashdot',
            'title': 'Slashdot',
            'type': 'xml',
            'color': '#016765',
            'col': '2',
            'row': '4',
            'mob': '14',
            'url': 'https://slashdot.org/',
            'feed': 'http://rss.slashdot.org/Slashdot/slashdotMain'
        },
        {
            'name': 'Sweethome',
            'title': 'Sweethome',
            'type': 'xml',
            'color': '#da6454',
            'col': '1',
            'row': '6',
            'mob': '15',
            'url': 'https://thewirecutter.com/home-garden/',
            'feed': 'https://thewirecutter.com/home-garden/feed/'
        },
        {
            'name': 'TechMeme',
            'title': 'TechMeme',
            'type': 'xml',
            'color': '#578aa1',
            'col': '3',
            'row': '5',
            'mob': '23',
            'url': 'http://techmeme.com/',
            'feed': 'http://www.techmeme.com/feed.xml'
        },
        {
            'name': 'TheNextWeb',
            'title': 'The Next Web',
            'type': 'xml',
            'color': '#F42',
            'col': '1',
            'row': '3',
            'mob': '20',
            'url': 'http://thenextweb.com/',
            'feed': 'https://thenextweb.com/feed/'
        },
        {
            'name': 'TheOnion',
            'title': 'The Onion',
            'type': 'xml',
            'color': '#006b3a',
            'col': '3',
            'row': '4',
            'mob': '19',
            'url': 'https://www.theonion.com/',
            'feed': 'https://www.theonion.com/feeds/rss'
        },
        {
            'name': 'TheRegister',
            'title': 'The Register',
            'type': 'xml',
            'color': '#f00',
            'col': '3',
            'row': '4',
            'mob': '18',
            'url': 'https://www.theregister.co.uk/',
            'feed': 'https://www.theregister.co.uk/headlines.atom'
        },
        {
            'name': 'TheVerge',
            'title': 'The Verge',
            'type': 'xml',
            'color': '#EC008C',
            'col': '3',
            'row': '1',
            'mob': '5',
            'url': 'https://www.theverge.com/',
            'feed': 'http://www.theverge.com/rss/index.xml'
        },
        {
            'name': 'Wirecutter',
            'title': 'Wirecutter',
            'type': 'xml',
            'color': '#dc3325',
            'col': '1',
            'row': '5',
            'mob': '16',
            'url': 'https://thewirecutter.com/',
            'feed': 'https://thewirecutter.com/feed/'
        },
        {
            'name': 'Wired',
            'title': 'Wired',
            'type': 'xml',
            'color': '#99DCF0',
            'col': '3',
            'row': '2',
            'mob': '17',
            'url': 'https://www.wired.com/',
            'feed': 'https://www.wired.com/feed/'
        }
    ]
};
