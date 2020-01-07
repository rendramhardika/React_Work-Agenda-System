import React, { useState, useEffect } from 'react'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import bootstrapPlugin from "@fullcalendar/bootstrap";
import '../../src/kalender.css'
import Axios from "axios";
import { Row, Modal, Col, Select, Drawer } from 'antd';
import Swal from 'sweetalert2';
import { MDBIcon } from 'mdbreact';

const { Option } = Select

function Kalender() {
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [addConfirmLoading, setAddConfirmLoading] = useState(false)
    const [holidayModalVisible, setHolidayModalVisible] = useState(false);
    const [holidayConfirmLoading, setHolidayConfirmLoading] = useState(false)
    const [detailAgendaVisible, setDetailAgendaVisible] = useState(false)
    const [agendas, setAgendas] = useState([]);
    const [unitsId, setUnitsId] = useState([])
    // const [unitsName, setUnitsName] = useState([])
    const [jabatan] = useState(null)

    useEffect(() => {
        // fetchAgendas(unit, jabatan)
        getUnits()
    }, [])

    async function fetchAgendas(unit_id, id_jabatan) {
        let res = await Axios.get(
            `https://agenda.dev.usu.ac.id/api/agendas?unit_id=${unit_id}&id_jabatan=${id_jabatan}`
        );

        let resData = await res.data.data;
        setAgendas(resData)

    }

    async function getUnits() {
        let unitsIdData = []
        let unitsNameData = []
        let res = await Axios.get(
            'https://api.usu.ac.id/0.1/units'
        );
        let resData = await res.data.data;
        resData.forEach(unit => {
            unitsIdData.push(unit.id)
            unitsNameData.push(unit.name)
            if ('children' in unit === true) {
                unit.children.forEach(subUnit => {

                    unitsIdData.push(subUnit.id)
                    unitsNameData.push(subUnit.name)
                })
            }
        });
        // setUnits(...units, {unitId:unitsIdData, unitName:unitsNameData})
        setUnitsId(unitsIdData)
        // setUnitsName(unitsNameData)
    }

    // async function getJabatan(unit_id) {
    //     let res = await Axios.get(
    //         `https://api.usu.ac.id/0.1/units/${unit_id}`
    //     )
    //     let resData = await res.data.data;
    //     setJabatan(resData.officials)
    // }

    const handleUnitChange = (value) => {
        // getJabatan(value)

        fetchAgendas(value, "")
    }

    const handleJabatanChange = (value) => {
        // fetchAgendas()
    }

    const handleDateClick = info => {
        console.log(agendas)
        // jabatan.forEach(j=>{console.log(j)})
        var dateBox = info.dayEl.className;
        if (dateBox.includes("fc-past")) {
            disableAddAgenda();
        } else {
            addAgenda();
        }
    };

    const handleAgendaClick = info => {
        const agendaData = info.event._def.extendedProps
        setDetailAgendaVisible(!detailAgendaVisible)
        console.log(agendaData.status_data)
        agendaData.status_data.forEach(status => { console.log(status) })
    }

    const onClose = () => {
        setDetailAgendaVisible(!detailAgendaVisible)
    };

    const addAgenda = () => {
        toggleAddModal();
    };

    const addHoliday = () => {
        toggleAddHoliday();
    };

    const disableAddAgenda = () => {
        Swal.fire({
            title: "Gagal",
            text: "Tidak dapat menambah agenda pada tanggal yang telah lewat",
            icon: "warning"
        });
    };

    const toggleAddModal = () => {
        setAddModalVisible(!addModalVisible);
    };

    const cancelAddModal = () => {
        setAddModalVisible(!addModalVisible)
        setAddConfirmLoading(false)
    }

    const toggleAddHoliday = () => {
        setHolidayModalVisible(!holidayModalVisible);
    };

    const cancelAddHoliday = () => {
        setHolidayModalVisible(!holidayModalVisible)
        setHolidayConfirmLoading(false)
    }

    const submitAddAgenda = () => {
        setAddConfirmLoading(!addConfirmLoading)
        setTimeout(() => {
            setAddModalVisible(!addModalVisible)
            setAddConfirmLoading(false)
        }, 2000);
    }

    const submitAddHoliday = () => {
        setHolidayConfirmLoading(!holidayConfirmLoading)
        setTimeout(() => {
            setHolidayModalVisible(!holidayModalVisible)
            setHolidayConfirmLoading(false)
        }, 2000);
    }

    return (

        <div className="container-fluid">
            <h3 className="h3-responsive text-center font-weight-normal w-100 mt-4 mb-4">
                Sistem Informasi Agenda Pimpinan Universitas Sumatera Utara
            </h3>
            <Row className="ml-1 mr-1 d-flex justify-content-center">
                <div className="col-auto">
                    <p>
                        <MDBIcon icon="square" className="green-text mr-1"></MDBIcon>
                        <small>Agenda aktif</small>
                    </p>
                </div>
                <div className="col-auto">
                    <p>
                        <MDBIcon icon="square" className="amber-text mr-1"></MDBIcon>
                        <small>Agenda ditunda (waktu belum diketahui)</small>
                    </p>
                </div>
                <div className="col-auto">
                    <p>
                        <MDBIcon icon="square" className="red-text mr-1"></MDBIcon>
                        <small>Agenda ditunda</small>
                    </p>
                </div>
                <div className="col-auto">
                    <p>
                        <MDBIcon icon="square" className="cyan-text mr-1"></MDBIcon>
                        <small>Agenda telah terlaksana</small>
                    </p>
                </div>
                <div className="col-auto">
                    <p>
                        <MDBIcon icon="square" className="indigo-text mr-1"></MDBIcon>
                        <small>Hari Libur</small>
                    </p>
                </div>

            </Row>
            <br />
            {/* FILTER UNIT AND JABATAN */}
            <Row className="no-gutters justify-content-start">
                <Col span={6} className="mb-3 mr-1">
                    <label><strong>Pilih Unit Kerja</strong></label><br />
                    <Select defaultValue="Unit" onChange={handleUnitChange} style={{ width: 300 }}>
                        {
                            unitsId.map(unit => (
                                <Option key={unit}>{unit}</Option>
                            ))
                        }
                    </Select>
                </Col>
                {
                    jabatan === null ?
                        <Col></Col>
                        :
                        <Col span={6} className="mb-3 mr-1">
                            <label><strong>Pilih Jabatan</strong></label><br />
                            <Select defaultValue="Jabatan" onChange={handleJabatanChange} style={{ width: 300 }}>
                                {
                                    jabatan.map(j => (
                                        <Option key={j.id}>{j.title}</Option>
                                    ))
                                }
                            </Select>
                        </Col>
                }

            </Row>

            {/* FULLCALENDAR PLUGIN */}
            <Row className="ml-1 mr-1">
                <FullCalendar
                    locale="ID"
                    themeSystem="bootstrap"
                    defaultView="dayGridMonth"
                    events={agendas !== null ? agendas : ''}
                    eventClick={
                        handleAgendaClick
                    }
                    plugins={[
                        bootstrapPlugin,
                        dayGridPlugin,
                        timeGridPlugin,
                        interactionPlugin
                    ]}
                    dateClick={handleDateClick}
                    header={{
                        center: "title",
                        left: "prev, next, addAgenda",
                        right: "today, addHoliday, exportAgenda, viewAgenda, logout"
                    }}
                    columnHeaderFormat={{
                        weekday: "long"
                    }}
                    customButtons={{
                        addAgenda: {
                            text: "Tambah Agenda",
                            click: function (info) {
                                addAgenda();
                            }
                        },
                        addHoliday: {
                            text: "Hari Libur",
                            click: function () {
                                addHoliday()
                                console.log("add holiday button was clicked");
                            }
                            // addHoliday()
                        },
                        exportAgenda: {
                            text: "Cetak Agenda",
                            click: function () {
                                // exportAgenda()
                                console.log("Export Agenda button was clicked");
                            }
                        },
                        viewAgenda: {
                            text: "Tampilkan Layar",
                            click: function () {
                                // viewAgenda()
                                console.log("Layar Agenda button was clicked");
                            }
                        },
                        logout: {
                            text: "Logout",
                            click: function () {
                                // logout()
                                console.log("logout button was clicked");
                            }
                        }
                    }}
                    buttonText={{
                        today: "Hari Ini"
                    }}
                />
            </Row>

            {/* Placement for Detail Agenda */}
            <Drawer
                onClose={onClose}
                placement="right"
                closable={true}
                title="Detail Agenda"
                visible={detailAgendaVisible}
            >

            </Drawer>

            {/* ADD AGENDA MODAL */}
            <Modal
                title="Tambah Agenda"
                confirmLoading={addConfirmLoading}
                visible={addModalVisible}
                onOk={submitAddAgenda}
                onCancel={cancelAddModal}
            >
                <h3>Add Modal Content</h3>
            </Modal>

            {/* ADD HOLIDAY MODAL */}
            <Modal
                title="Tambah Hari Libur"
                confirmLoading={holidayConfirmLoading}
                visible={holidayModalVisible}
                onOk={submitAddHoliday}
                onCancel={cancelAddHoliday}
            >
                <h3>Add New Holiday</h3>
            </Modal>
        </div>
    )

}
export default Kalender