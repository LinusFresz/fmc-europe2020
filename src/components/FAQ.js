import React from 'react'
import styled from 'styled-components'

import ReactHtmlParser from 'react-html-parser'

const FAQWrapper = styled.div`
  height: 500px;
  display: flex;
  flex-direction: column;
`

const QuestionWrapper = styled.div`
  max-width: 90%;
`
const Question = styled.div`
  font-weight: 500 !important;
`
const Answer = styled.div``

const Divider = styled.div`
  border-bottom: 1px solid var(--yellow);
  background-color: var(--ice);
  height: 1px;
  margin: 0.5em 0px 1.5em;

  span {
    display: block;
    width: 50%;
    height: 1px;
    background-color: var(--green);
  }
`

export default class FAQ extends React.Component {
  render() {
    return (
      <FAQWrapper id="FAQSection" className="section">
        <h2>Frequently Asked Questions</h2>
        <div>
          {this.props.faqEntries.map(el => (
            <QuestionWrapper key={el.node.id}>
              <Question>{el.node.question}</Question>
              <Answer>{ReactHtmlParser(el.node.answer)}</Answer>
              <Divider>
                <span></span>
              </Divider>
            </QuestionWrapper>
          ))}
        </div>
      </FAQWrapper>
    )
  }
}
