import React, { Component } from 'react';
import Flag from 'react-world-flags';
import './Home.css';
import yaillo from "../images/yaillo.png";

export class Default extends Component {
    static displayName = Default.name;

  constructor(props) {
    super(props);
    this.state = { currentCount: 0 };
  }


  render() {
      return (
          <div className='default-view' >
              <div className='container-fluid'>
                  <div className="row " style={{ marginBottom: `20px`, marginTop:`15px` }}>
                      <div className="col-4">
                          <a href="/">
                              <div className='logo-background' title='Yaillo !' style={{ backgroundImage: `url(${yaillo})` }} >
                              </div>
                          </a>
                      </div>
                  </div>
                  <div className="row" style={{ marginBottom: `20px`, marginTop: `30px` }}>
                       <div className='col-12' >
                       <h1 className='title-1' >Yaillo afrique francophone !</h1>
                       <h2 style={{ fontWeight: `300` }}>Choisissez votre ville</h2>
                        </div>
                      <div className="col-12 col-sm-6 col-md-4 sample-background-container">
                          <a href="/location/abidjan">
                              <div className='sample-background' style={{ backgroundImage: `url(${'https://st6808.ispot.cc/media/abidjancity.jpg'})` }}   >
                              </div>
                              <h4>Abidjan</h4>
                              <span>617 business</span>
                          </a>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 sample-background-container">
                          <a href="/location/douala">
                              <div className='sample-background' style={{ backgroundImage: `url(${'https://st6808.ispot.cc/media/doualacity.jpg'})` }}   >
                              </div>
                              <h4>Douala</h4>
                              <span>502 business</span>
                          </a>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 sample-background-container">
                          <a href="/location/yaounde">
                              <div className='sample-background' style={{ backgroundImage: `url(${'https://st6808.ispot.cc/media/yaoundecity.jpg'})` }}  >
                              </div>
                              <h4>Yaounde</h4>
                              <span>584 business</span>
                          </a>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 sample-background-container">
                          <a href="/location/bamako">
                              <div className='sample-background' style={{ backgroundImage: `url(${'https://st6808.ispot.cc/media/bamakocity.jpg'})` }}   >
                              </div>
                              <h4>Bamako</h4>
                              <span>0 business</span>
                          </a>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 sample-background-container">
                          <a href="/location/brazzaville">
                              <div className='sample-background' style={{ backgroundImage: `url(${'https://st6808.ispot.cc/media/brazzacity.jpg'})` }}   >
                              </div>
                              <h4>Brazzaville</h4>
                              <span>0 business</span>
                          </a>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 sample-background-container">
                          <a href="/location/kinshasa">
                              <div className='sample-background' style={{ backgroundImage: `url(${'https://st6808.ispot.cc/media/kincity.jpg'})` }}  >
                              </div>
                              <h4>Kinshasa</h4>
                              <span>0 business</span>
                          </a>
                      </div>
                  </div>
          
              </div>
      </div>
    );
  }
}


//<div className='row'>
//    <div className='col-12' >
//        <h1 className='title-1' >Yaillo afrique francophone !</h1>
//        <h2 style={{ fontWeight: `300` }}>Choisissez votre ville</h2>
//    </div>
//    <div className='col-12 col-sm-6 col-lg-3 city-column'>
//        <span className="city-link"><a href="/location/abidjan"><Flag code="CI" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Abidjan</a></span>
//        <br />
//        <br />
//        <span className="city-link"><a href="/location/bouake"><Flag code="CI" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Bouake</a></span>
//        <br />
//        <br />
//        <span className="city-link"><a href="/location/yamoussoukro"><Flag code="CI" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Yamoussoukro </a></span>
//        <br />
//        <br />
//        <span className="city-link"><a href="/location/korhogo"><Flag code="CI" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Korhogo </a></span>
//        <br />
//        <br />
//        <span className="city-link"><a href="/location/dakar"><Flag code="SN" fallback={<span>nan</span>} height="16" className='flag-size-list' />Dakar </a></span>
//        <br />
//        <br />
//        <span className="city-link"><a href="/location/ouagadougou"><Flag code="BF" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Ouagadougou </a></span>
//        <br />
//    </div>
//    <div className='col-12 col-sm-6 col-lg-3 city-column'>
//        <span className="city-link"><a href="/location/conakry"><Flag code="GN" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Conakry </a></span>
//        <br />
//        <br />
//        <span className="city-link"><a href="/location/lome"><Flag code="TG" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Lome </a></span>
//        <br />
//        <br />
//        <span className="city-link"><a href="/location/porto-novo"><Flag code="BJ" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Porto-Novo </a></span>
//        <br />
//        <br />
//        <span className="city-link"><a href="/location/cotonou"><Flag code="BJ" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Cotonou </a></span>
//        <br />
//        <br />
//        <span className="city-link"><a href="/location/abomey-calavi"><Flag code="BJ" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Abomey-Calavi </a></span>
//        <br />
//        <br />
//        <span className="city-link"><a href="/location/bamako"><Flag code="ML" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Bamako </a></span>
//        <br />
//    </div>
//    <div className='col-12 col-sm-6 col-lg-3 city-column'>
//        <span className="city-link"><a href="/location/libreville"><Flag code="GA" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Libreville </a></span>
//        <br />
//        <br />
//        <span className="city-link"><a href="/location/oyem"><Flag code="GA" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Oyem </a></span>
//        <br />
//        <br />
//        <span className="city-link"><a href="/location/brazzaville"><Flag code="CG" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Brazzaville </a></span>
//        <br />
//        <br />
//        <span className="city-link"><a href="/location/pointe-noire"><Flag code="CG" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Pointe-Noire </a></span>
//        <br />
//        <br />
//        <span className="city-link"><a href="/location/kinshasa"><Flag code="CD" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Kinshasa </a></span>
//        <br />
//        <br />
//        <span className="city-link"><a href="/location/lumumbashi"><Flag code="CD" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Lumumbashi </a></span>
//        <br />
//    </div>
//    <div className='col-12 col-sm-6 col-lg-3 city-column'>
//        <span className="city-link"><a href="/location/douala"><Flag code="CM" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Douala </a></span>
//        <br />
//        <br />
//        <span className="city-link"><a href="/location/yaounde"><Flag code="CM" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Yaounde </a></span>
//        <br />
//        <br />
//        <span className="city-link"><a href="/location/garoua"><Flag code="CM" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Garoua </a></span>
//        <br />
//        <br />
//        <span className="city-link"><a href="/location/bafoussam"><Flag code="CM" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Bafoussam </a></span>
//        <br />
//        <br />
//        <span className="city-link"><a href="/location/limbe"><Flag code="CM" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Limbe </a></span>
//        <br />
//        <br />
//        <span className="city-link"><a href="/location/kribi"><Flag code="CM" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Kribi </a></span>
//        <br />
//    </div>
//</div>