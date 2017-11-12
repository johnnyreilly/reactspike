// Adapted from https://github.com/kvz/locutus

export function strip_tags(input: string, allowed: string = '') {
  //  discuss at: http://locutus.io/php/strip_tags/
  // original by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Luke Godfrey
  // improved by: Kevin van Zonneveld (http://kvz.io)
  //    input by: Pul
  //    input by: Alex
  //    input by: Marc Palau
  //    input by: Brett Zamir (http://brett-zamir.me)
  //    input by: Bobby Drake
  //    input by: Evertjan Garretsen
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Eric Nagel
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Tomasz Wesolowski
  // bugfixed by: Tymon Sturgeon (https://scryptonite.com)
  //  revised by: Rafał Kukawski (http://blog.kukawski.pl)
  //   example 1: strip_tags('<p>Kevin</p> <br /><b>van</b> <i>Zonneveld</i>', '<i><b>')
  //   returns 1: 'Kevin <b>van</b> <i>Zonneveld</i>'
  //   example 2: strip_tags('<p>Kevin <img src="someimage.png" onmouseover="someFunction()">van <i>Zonneveld</i></p>', '<p>')
  //   returns 2: '<p>Kevin van Zonneveld</p>'
  //   example 3: strip_tags("<a href='http://kvz.io'>Kevin van Zonneveld</a>", "<a>")
  //   returns 3: "<a href='http://kvz.io'>Kevin van Zonneveld</a>"
  //   example 4: strip_tags('1 < 5 5 > 1')
  //   returns 4: '1 < 5 5 > 1'
  //   example 5: strip_tags('1 <br/> 1')
  //   returns 5: '1  1'
  //   example 6: strip_tags('1 <br/> 1', '<br>')
  //   returns 6: '1 <br/> 1'
  //   example 7: strip_tags('1 <br/> 1', '<br><br/>')
  //   returns 7: '1 <br/> 1'
  //   example 8: strip_tags('<i>hello</i> <<foo>script>world<</foo>/script>')
  //   returns 8: 'hello world'

  // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
  allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');

  const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  const commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;

  let before = input;
  let after = input;
  // recursively remove tags to ensure that the returned string doesn't contain forbidden tags after previous passes (e.g. '<<bait/>switch/>')
  while (true) {
    before = after;
    after = before.replace(commentsAndPhpTags, '').replace(tags, ($0, $1) =>
      allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''
    );

    // return once no more tags are removed
    if (before === after) {
      return after;
    }
  }
}

// tslint:disable-next-line:variable-name
const htmlspecialchars_decode_OPTS = {
  'ENT_NOQUOTES': 0,
  'ENT_HTML_QUOTE_SINGLE': 1,
  'ENT_HTML_QUOTE_DOUBLE': 2,
  'ENT_COMPAT': 2,
  'ENT_QUOTES': 3,
  'ENT_IGNORE': 4
};

export function htmlspecialchars_decode(theString: string, quoteStyle?: number | string | string[]) { // eslint-disable-line camelcase
  //       discuss at: http://locutus.io/php/htmlspecialchars_decode/
  //      original by: Mirek Slugen
  //      improved by: Kevin van Zonneveld (http://kvz.io)
  //      bugfixed by: Mateusz "loonquawl" Zalega
  //      bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //         input by: ReverseSyntax
  //         input by: Slawomir Kaniecki
  //         input by: Scott Cariss
  //         input by: Francois
  //         input by: Ratheous
  //         input by: Mailfaker (http://www.weedem.fr/)
  //       revised by: Kevin van Zonneveld (http://kvz.io)
  // reimplemented by: Brett Zamir (http://brett-zamir.me)
  //        example 1: htmlspecialchars_decode("<p>this -&gt; &quot;</p>", 'ENT_NOQUOTES')
  //        returns 1: '<p>this -> &quot;</p>'
  //        example 2: htmlspecialchars_decode("&amp;quot;")
  //        returns 2: '&quot;'

  let optTemp = 0;
  let i = 0;
  let noquotes = false;

  if (typeof quoteStyle === 'undefined') {
    quoteStyle = 2;
  }
  theString = theString.toString()
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
  if (quoteStyle === 0) {
    noquotes = true;
  }
  if (typeof quoteStyle !== 'number') {
    // Allow for a single string or an array of string flags
    quoteStyle = [].concat(quoteStyle);
    for (i = 0; i < quoteStyle.length; i++) {
      // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
      if (htmlspecialchars_decode_OPTS[quoteStyle[i]] === 0) {
        noquotes = true;
      } else if (htmlspecialchars_decode_OPTS[quoteStyle[i]]) {
        // tslint:disable-next-line:no-bitwise
        optTemp = optTemp | htmlspecialchars_decode_OPTS[quoteStyle[i]];
      }
    }
    quoteStyle = optTemp;
  }
  // tslint:disable-next-line:no-bitwise
  if (quoteStyle & htmlspecialchars_decode_OPTS.ENT_HTML_QUOTE_SINGLE) {
    // PHP doesn't currently escape if more than one 0, but it should:
    theString = theString.replace(/&#0*39;/g, '\'');
    // This would also be useful here, but not a part of PHP:
    // string = string.replace(/&apos;|&#x0*27;/g, "'");
  }
  if (!noquotes) {
    theString = theString.replace(/&quot;/g, '"');
  }
  // Put this in last place to avoid escape being double-decoded
  theString = theString.replace(/&amp;/g, '&');

  return theString;
}

// tslint:disable-next-line:variable-name
const htmlspecialchars_OPTS = {
  'ENT_NOQUOTES': 0,
  'ENT_HTML_QUOTE_SINGLE': 1,
  'ENT_HTML_QUOTE_DOUBLE': 2,
  'ENT_COMPAT': 2,
  'ENT_QUOTES': 3,
  'ENT_IGNORE': 4
};

export function htmlspecialchars(theString: string, quoteStyle?: number | string | string[], _charset?: string, doubleEncode?: boolean) {
  //       discuss at: http://locutus.io/php/htmlspecialchars/
  //      original by: Mirek Slugen
  //      improved by: Kevin van Zonneveld (http://kvz.io)
  //      bugfixed by: Nathan
  //      bugfixed by: Arno
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //       revised by: Kevin van Zonneveld (http://kvz.io)
  //         input by: Ratheous
  //         input by: Mailfaker (http://www.weedem.fr/)
  //         input by: felix
  // reimplemented by: Brett Zamir (http://brett-zamir.me)
  //           note 1: charset argument not supported
  //        example 1: htmlspecialchars("<a href='test'>Test</a>", 'ENT_QUOTES')
  //        returns 1: '&lt;a href=&#039;test&#039;&gt;Test&lt;/a&gt;'
  //        example 2: htmlspecialchars("ab\"c'd", ['ENT_NOQUOTES', 'ENT_QUOTES'])
  //        returns 2: 'ab"c&#039;d'
  //        example 3: htmlspecialchars('my "&entity;" is still here', null, null, false)
  //        returns 3: 'my &quot;&entity;&quot; is still here'

  let optTemp = 0;
  let i = 0;
  let noquotes = false;
  if (typeof quoteStyle === 'undefined' || quoteStyle === null) {
    quoteStyle = 2;
  }
  theString = theString || '';
  theString = theString.toString();

  if (doubleEncode !== false) {
    // Put this first to avoid double-encoding
    theString = theString.replace(/&/g, '&amp;');
  }

  theString = theString
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  if (quoteStyle === 0) {
    noquotes = true;
  }
  if (typeof quoteStyle !== 'number') {
    // Allow for a single string or an array of string flags
    quoteStyle = [].concat(quoteStyle);
    for (i = 0; i < quoteStyle.length; i++) {
      // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
      if (htmlspecialchars_OPTS[quoteStyle[i]] === 0) {
        noquotes = true;
      } else if (htmlspecialchars_decode_OPTS[quoteStyle[i]]) {
        // tslint:disable-next-line:no-bitwise
        optTemp = optTemp | htmlspecialchars_OPTS[quoteStyle[i]];
      }
    }
    quoteStyle = optTemp;
  }
  // tslint:disable-next-line:no-bitwise
  if (quoteStyle & htmlspecialchars_OPTS.ENT_HTML_QUOTE_SINGLE) {
    theString = theString.replace(/'/g, '&#039;');
  }
  if (!noquotes) {
    theString = theString.replace(/"/g, '&quot;');
  }

  return theString;
}