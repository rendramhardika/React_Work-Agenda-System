import React, { useState, useEffect } from 'react'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import '../../src/kalender.css'
import Axios from "axios";
import { Row, Modal, Col, Select, Button } from 'antd';
import Swal from 'sweetalert2';
import { MDBIcon, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter } from 'mdbreact';

const { Option } = Select

function Kalender() {
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [addConfirmLoading, setAddConfirmLoading] = useState(false)
    const [holidayModalVisible, setHolidayModalVisible] = useState(false);
    const [holidayConfirmLoading, setHolidayConfirmLoading] = useState(false)
    const [detailAgendaVisible, setDetailAgendaVisible] = useState(false)
    const [units, setUnits] = useState([])
    const [roles, setRoles] = useState(null)
    const [agendas, setAgendas] = useState([]);
    const [unit, setUnit] = useState()
    const [role, setRole] = useState()


    useEffect(() => {
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
        let res = await Axios.get(
            'https://api.usu.ac.id/0.1/units'
        );
        let resData = await res.data.data;

        resData.forEach(unit => {
            if ('children' in unit === true) {
                let subUnit = unit['children']
                subUnit.forEach(data => {
                    resData.push(data)
                    if ('children' in data === true) {
                        let subSubUnit = data['children']
                        subSubUnit.forEach(data => {
                            resData.push(data)
                            if ('children' in data === true) {
                                let subSubSubUnit = data['children']
                                resData.push(...subSubSubUnit)
                            }
                        })
                    }
                })
            }
        })

        setUnits(resData)
    }

    async function getRoles(unit) {
        let rolesData = [{ id: 'semua jabatan', title: 'Semua Jabatan' }]
        let res = await Axios.get(
            `https://api.usu.ac.id/0.1/units/${unit}`
        );
        let resData = await res.data.data.officials
        rolesData.push(...resData)
        setRoles(rolesData)

    }

    const handleUnitChange = (value) => {
        setUnit(value)
        getRoles(value)
    }

    const handleJabatanChange = (value) => {
        setRole(value)
        value === "semua jabatan" ? fetchAgendas(unit, "") : fetchAgendas(unit, role)
    }

    const handleDateClick = info => {
        var dateBox = info.dayEl.className;
        dateBox.includes("fc-past") ? disableAddAgenda() : addAgenda()
    };

    const handleAgendaClick = info => {
        const agendaData = info.event._def.extendedProps
        setDetailAgendaVisible(!detailAgendaVisible)
        console.log(agendaData.status_data)
        agendaData.status_data.forEach(status => { console.log(status) })
    }

    const handleEventRender = info => {
        const status = info.event._def.extendedProps.status_agenda
        if (status === 'terlaksana') {
            info.el.classList.add('terlaksana')
        }
        else {
            info.el.classList.add('berjalan')
        }
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

    const eventColorCheck = () => {
        agendas.map(agenda => {
            if (agenda.status === 'berjalan') {
                return 'green'
            }
            else if (agenda.status === 'tunda') {
                return 'red'
            } else {
                return 'blue'
            }
        })
    }

    const toggleDetailAgenda = () => {
        setDetailAgendaVisible(!detailAgendaVisible)
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
                    <Select showSearch defaultValue="Unit" optionFilterProp="children" onChange={handleUnitChange} style={{ width: 300 }} filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                        {
                            units.map(unit => (
                                <Option key={unit.id}>{unit.name}</Option>
                            ))
                        }
                    </Select>
                </Col>
                {
                    roles === null ?
                        <Col></Col>
                        :
                        <Col span={6} className="mb-3 mr-1">
                            <label><strong>Pilih Jabatan</strong></label><br />
                            <Select defaultValue="Jabatan" onChange={handleJabatanChange} style={{ width: 300 }}>
                                {
                                    roles.map(role => (
                                        <Option key={role.id}>{role.title}</Option>
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
                    eventRender={handleEventRender}
                    eventLimit={true}
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
            <MDBModal isOpen={detailAgendaVisible} toggle={toggleDetailAgenda} fullHeight position="right" >
                <MDBModalHeader toggle={toggleDetailAgenda}>Detail Agenda</MDBModalHeader>
                <MDBModalBody>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore
              magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat.
                </MDBModalBody>
                <MDBModalFooter >
                    <Button type="danger" size="large">Hapus Agenda</Button>
                    <Button type="primary" size="large">Ubah Agenda</Button>
                </MDBModalFooter>

            </MDBModal>


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