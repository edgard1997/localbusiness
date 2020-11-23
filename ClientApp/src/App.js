import React, { Component } from "react";
import { Route } from "react-router";
import { Switch, Redirect } from "react-router-dom";
import { Layout } from "./components/Layout";
import { BlankLayout } from "./components/BlankLayout";
import AuthorizeRoute from "./components/api-authorization/AuthorizeRoute";
import ApiAuthorizationRoutes from "./components/api-authorization/ApiAuthorizationRoutes";
import { ApplicationPaths } from "./components/api-authorization/ApiAuthorizationConstants";
import "./custom.css";
import Register from "./components/Register/Register";
import PartnerRegister from "./components/PartnerRegister/PartnerRegister";
import { AuthorizedLayout } from "./components/AuthorizedLayout";
import AccountLayout from "./components/Account/AccountLayout";
import PartnerProfile from "./components/Profiles/PartnerProfile";
import Search from "./components/Search/Search";
import Biz from "./components/Search/Biz";
import Discover from "./components/Discover/Discover";
import { DataContextProvider } from "./components/Global/GlobalContext";
import { Default } from "./components/Default";
import MobileSearch from "./components/MobileSearch";
import Terms from "./components/Mention/Terms";
import Business from "./components/Mention/Business";
import Payment from "./components/Mention/Payment";
import Help from "./components/Mention/Help";
import Accueil from "./components/Acceuil";


export default class App extends Component {
  static displayName = App.name;

  render() {
      return (
          <DataContextProvider>
              <Switch>
              <Route path="/user/compte">
                  <AuthorizedLayout>
                          <AuthorizeRoute path="/user/compte" component={AccountLayout} />
                  </AuthorizedLayout>
                  </Route>
                  <Route path="/partenaire/dashboard">
                      <AuthorizedLayout>
                          <AuthorizeRoute path="/partenaire/dashboard" component={PartnerProfile} />
                      </AuthorizedLayout>
                  </Route>
                  <Route exact path="/">
                      <BlankLayout>
                          <Route path="/" component={Default} />
                      </BlankLayout>
                  </Route>
                  <Route path="/terms">
                          <Route path="/terms" component={Terms} />
                  </Route>
                  <Route  path="/business">
                          <Route path="/business" component={Business} />
                  </Route>
                  <Route path="/payment">
                      <BlankLayout>
                          <Route path="/payment" component={Payment} />
                      </BlankLayout>
                  </Route>
                  <Route path="/help">
                      <BlankLayout>
                          <Route path="/help" component={Help} />
                      </BlankLayout>
                  </Route>
                  <Route path={`/activite/:city`}>
                      <Layout>
                          <Route path={`/activite/:city`} component={Discover} />
                      </Layout>
                  </Route>
                  <Route path={`/search/:city`}>
                      <Layout>
                          <Route path={`/search/:city`} component={MobileSearch} />
                      </Layout>
                  </Route>
                  <Route path={`/recherche/:city/:category/:pager/:quer`} >
                      <Layout>
                          <Route path={`/recherche/:city/:category/:pager/:quer`} component={Search} />
                      </Layout>
                  </Route>
                  <Route path={`/location/:city`} >
                      <Layout>
                          <Route path={`/location/:city`} component={Accueil} />
                      </Layout>
                  </Route>
                  <Route path={`/biz/:city/:bizId`} >
                      <Layout>
                          <Route exact path={`/biz/:city/:bizId`} component={Biz} />
                      </Layout>
                  </Route>
                  <Route path={`/partenariat/:city`} >
                      <BlankLayout>
                          <Route path={`/partenariat/:city`} component={PartnerRegister} />
                      </BlankLayout>
                  </Route>
                  <Route path={`/inscription/:city`} >
                      <BlankLayout>
                          <Route path={`/inscription/:city`} component={Register} />
                      </BlankLayout>
                  </Route>
                  <Route path="/(authentication)">
                      <BlankLayout>
                          <Route
                              path={ApplicationPaths.ApiAuthorizationPrefix}
                              component={ApiAuthorizationRoutes}
                          />
                      </BlankLayout>
                  </Route>
              </Switch>
          </DataContextProvider>
    );
  }
}
