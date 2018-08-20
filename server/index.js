const express = require( 'express' );
const axios = require( 'axios' );
const cors = require( 'cors' );
const xmlParser = require( 'fast-xml-parser' );
const app = express();
const port = process.env.PORT || 3001;

app.use(
  cors()
);

app.get( '/latest-deals', async ( req, res ) => {
  try {
    const { data } = await axios( 'https://www.ozbargain.com.au/deals/feed' );

    if ( !xmlParser.validate( data ))
      throw new Error({ message: 'Unable to parse XML' });

    const parsed = xmlParser.parse( data );
    const latestDeals = parsed.rss.channel.item;

    res.send( latestDeals );
  }
  catch ( error ) {
    res.status( 400 );
    res.send( error );
  }
});

app.listen( port, () => {
  console.log( 'listening on port ' + port )
});
