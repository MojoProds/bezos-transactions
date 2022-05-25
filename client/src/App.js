import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import './App.css';
import TransactionTable from './components/TransactionTable';

function App() {
  const [ totalBalance, setTotalBalance ] = useState([]);
  const [ bezosBalance, setBezosBalance ] = useState([]);
  const [ bezosPercentage, setBezosPercentage ] = useState([]);
  const [ transactions, setTransactions ] = useState([]);
  const [ selectedTransaction, setSelectedTransaction ] = useState([]);

  function loadTransactions() {
    axios
      .get('/transactions')
      .then((response) => {
        setTotalBalance(response.data.totalBalance);
        setBezosBalance(response.data.bezosBalance);
        setBezosPercentage(response.data.bezosPercentage);
        setTransactions(response.data.transactions);
      })
      .catch((error) => console.log(error));
  }

  function onBezosClicked() {
    axios
      .post('/merchant', {
        merchant_name: selectedTransaction.merchant_name,
        isBezosCompany: true,
      })
      .then((response) => alert(response.data))
      .then(() => loadTransactions());
  }

  function onNotBezosClicked() {
    axios
      .post('/merchant', {
        merchant_name: selectedTransaction.merchant_name,
        isBezosCompany: false,
      })
      .then((response) => alert(response.data))
      .then(() => loadTransactions());
  }

  useEffect(() => loadTransactions(), []);

  useEffect(() => {
    const timer = setInterval(loadTransactions, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="App">
      <h1>Jan 2029 Transactions</h1>
      <CardGroup className="balanceContainer">
        <Card className="balance">
          <Card.Header>Total Balance</Card.Header>
          <Card.Body>{totalBalance}</Card.Body>
        </Card>
        <Card className="balance">
          <Card.Header>Bezos Balance</Card.Header>
          <Card.Body>{bezosBalance}</Card.Body>
        </Card>
        <Card className="balance">
          <Card.Header>Percentage</Card.Header>
          <Card.Body>{bezosPercentage}</Card.Body>
        </Card>
      </CardGroup>
      <Row className="buttonContainer">
        <Button
          as={Col}
          variant="danger"
          className="mx-3"
          onClick={onBezosClicked}
        >
          Mark as Bezos company
        </Button>
        <Button
          as={Col}
          variant="success"
          className="mx-3"
          onClick={onNotBezosClicked}
        >
          Mark as NOT Bezos company
        </Button>
      </Row>
      <Card body>
        <TransactionTable
          data={transactions}
          onClickRow={setSelectedTransaction}
          getSelectedId={() => selectedTransaction.id}
        />
      </Card>
    </div>
  );
}

export default App;
