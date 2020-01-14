import React, { useState } from 'react'
import { Col, Row } from "antd";
import '../../src/screen.css'

function AgendaCard(props) {
    const [agenda]= useState(props.agenda)
    return(
        <Col span={12} className="my-4">
            <Row gutter={0} className="no-gutters">
                <Col className="col-xl-3">
                    <div className="date-wrap py-0 py-xl-1">
                        <h1 className="display-4 text-center text-uppercase date">hari <br/> date </h1>
                    </div>
                </Col>
            </Row>

        </Col>
    )
}