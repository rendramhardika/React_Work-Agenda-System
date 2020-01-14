import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import { Row, Col, Carousel, Pagination } from 'antd';
import '../../src/screen.css'
import logoUsu from '../../src/assets/logo-usu.png'

function AgendaPimpinan(props) {
    const [agendas, setAgendas] = useState([])
    const [unit, setUnit] = useState(props.unit)
    const [jabatan, setJabatan] = useState(props.jabatan)
    const [screenTotal, setScreenTotal] = useState(0)
    const [second, setSecond]=useState(0)
    const [date, setDate] = useState('')
    const [clock, setClock] = useState('')
    const [noAgenda, setNoAgenda] = useState(false)

    var dateTime = function () {
        let date = new Date()
        let jam = date.getHours()
        let menit = date.getMinutes()
        let detik = date.getSeconds()
        const options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
        setDate(date.toLocaleDateString('ID', options))
        setClock(jam+':'+menit+':'+detik)
    }

    async function fetchAgendas(unit, jabatan) {
        var screen;
        let res = await Axios.get(
            `https://agenda.dev.usu.ac.id/api/agendas?unit_id=${unit}&id_jabatan=${jabatan}`
        );
        let resData = await res.data.data
        console.log(resData)
        if(resData !== null){
            setAgendas(resData)
            screen = parseInt(resData.length / 12)
            res.length % 12 !==0 ? screen+=1 : screen+=0
        }
        else{
            // setNoAgenda(true)
        }
        setScreenTotal(screen)
    }

    // Live clock
    useEffect(()=>{
        const interval = setInterval(() => {
            dateTime()
        }, 1000)
        // return ()=>clearInterval(interval)
    })

    useEffect(() => {
        // fetchAgendas(unit, jabatan)
        fetchAgendas(unit, jabatan)
    }, [])

    return (
        <div className="container-fluid">
            <Row className="my-3 mt-5 left-header d-flex">
                <Col className="col-xl-auto mr-3">
                    <img className="" src={logoUsu} alt={'Logo USU'} height={250} />
                </Col>
                <Col className="col-xl-auto mr-3">
                    <h1 className="text-uppercase display-1 unitKerja" >agenda pimpinan fakultas kedokteran</h1>
                </Col>
                <Col className="col-xl-auto mr-3">
                    <h1 className="text-uppercase display-1 text-right" >{date} <br/>{clock}</h1>
                </Col>
            </Row>
            <Row>
                {
                    noAgenda ?
                    // console.log(agendas):
                    <h1 className="text-uppercase display-1 unitKerja text-center p-5 m-5">Tidak Ada Agenda</h1> :
                    <Row>
                        <Col span={12}>1</Col>
                        <Col span={12}>1</Col>
                        <Col span={12}>1</Col>
                        <Col span={12}>1</Col>
                        <Col span={12}>1</Col>
                        <Col span={12}>1</Col>
                        <Col span={12}>1</Col>
                        <Col span={12}>1</Col>
                        <Col span={12}>1</Col>
                        <Col span={12}>1</Col>
                        <Col span={12}>1</Col>
                        <Col span={12}>1</Col>
                    </Row>
                }
            </Row>
            <Row>
                <Pagination
                    defaultCurrent={1}
                    total={13}
                    pageSize={12}
                    hideOnSinglePage={true}
                />
            </Row>

        </div>
    )
}
export default AgendaPimpinan