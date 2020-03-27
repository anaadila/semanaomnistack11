import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import React from 'react';

import Routes from './src/routes';

//html => <div> <span> <header> ...
//Aqui no react native é tudo <dev> com as novas tipo <View> <Text>
//Aqui não tem semântica - tipo: todo <Text> é <Text> sem diferenças como no html <h1> <span> e por aí vai ...


export default function App() {
  return (
   <Routes />
  );
}
