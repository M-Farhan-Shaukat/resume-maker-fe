"use client";

import { useCallback, useEffect, useState } from "react";
import { FiEdit, FiList } from "react-icons/fi";
import "./Users.scss";
import moment from "moment";
import Image from "next/image";
import CreateUser from "./createUser";
import { base64ToBlob, LocalServer } from "@/app/utils";
import { useRouter } from "next/navigation";
import ToastNotification from "@/app/utils/Toast";
import { debounce, getErrorMessage } from "@/app/utils/helper";
import { FaListCheck } from "react-icons/fa6";
import {
  TableX,
  Pagination,
  SubHeader,
  ButtonX,
  SortableHeader,
} from "@/app/shared";
import {User} from "@/public/icons";
import {
  Badge,
  FormGroup,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import { ConfirmationPopover } from "@/app/shared/DeleteConfirmation";
import GenericField from "@/app/FormFields/sharedInput";
import { AiOutlineSearch } from "react-icons/ai";
import TooltipX from "@/app/shared/TooltipX";
import { Avatar } from "@/public/images";
import { FaFileCirclePlus } from "react-icons/fa6";

// import EditUser from "./Edituser";

const { ToastComponent } = ToastNotification;

export default function UsersList() {
  const router = useRouter();
  const [loading, setloading] = useState();
  const [modal, setModal] = useState(false);
  const [lastPage, setLastPage] = useState(1);
  const [userListing, setuserListing] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [status, setStatus] = useState(null);
  const [search, setSearch] = useState("");
  const [params, setParams] = useState({
    sortBy: "created_at",
    orderBy: "desc",
    pageSize: 20,
  });

  // const [currentuserid, setCurrentuserid] = useState(null);

  const fetchUsers = async (page = 1, query = "") => {
    setloading(true);
    try {
      const response = await LocalServer.get(
        `/api/user/listing?page=${page}&view=${params.pageSize}&search=${query}&sortBy=${params.sortBy}&orderBy=${params.orderBy}`
      );
      const data = response?.data?.data;
      setuserListing(data);
      setloading(false);
      setLastPage(data?.last_page);
    } catch (error) {
      setloading(false);
      setuserListing(false);
      ToastComponent("error", getErrorMessage(error));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [params]);

  const handleBusiness = (id) => {
    router.push(`/user-data/${id}`);
  };


  const CloseModal = () => {
    setModal(false);
    // setCurrentuserid(null);
  };

  const togglePopover = () => {
    setStatus(null);
    setSelectedProvider(null);
    setPopoverOpen(!popoverOpen);
  };

  const handleConfirm = async () => {
    setloading(true);
    try {
      const response = await LocalServer.put(
        `/api/user/active?userId=${selectedProvider?.id}&active=${status}`,
        {}
      );
      ToastComponent("success", response?.data?.message);
      setloading(false);
      fetchUsers();
      togglePopover();
    } catch (error) {
      ToastComponent("error", getErrorMessage(error));
      setloading(false);
      togglePopover();
    }
  };

  const debouncedFetchSearchResults = useCallback(
    debounce((query) => fetchUsers(1, query), 500),
    []
  );

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearch(query);
    debouncedFetchSearchResults(query);
  };

  const handleSort = (column, order) => {
    setParams({ ...params, sortBy: column, orderBy: order });
  };

  const handlePageSize = (size) => {
    setParams({ ...params, pageSize: size });
  };

  const columns = [
    {
      key: "image",
      sortable: false,
      label: "Profile Photo",
      className: "text-start",
      render: (value, row) => {
        return (
          <div className="d-flex gap-2 ">
            <div className="bg-circle">
              {row.image ? (
                <Image
                  src={
                    row?.image ? base64ToBlob(row?.image) : null
                  }
                  alt={row?.name}
                  className="img-fluid"
                  width={100}
                  height={100}
                />
              ) : (
                <Image src={Avatar} alt="user pic" className="img-fluid" />
              )}
            </div>
            <div className="">
              <span className="d-block">{row?.businnameess_name}</span>
            </div>
          </div>
        );
      },
    },
    { key: "name", label: "Name", sortable: true },
    {
      key: "email",
      sortable: true,
      label: "Email",
    },
    
    {
      key: "email_confirmation",
      label: "Status",
      sortable: true,
      render: (value) => {
        return (
          <>
            {value !== 0 ? (
              <Badge color="success">Confirmed</Badge>
            ) : (
              <Badge color="warning">Pending</Badge>
            )}
          </>
        );
      },
    },
    {
      key: "role_id",
      sortable: true,
      label: "Role",
      render: (value) => {
        return (
          <>
            {value !== 1 ? (
              <Badge color="primary">User</Badge>
            ) : (
              <Badge color="success">Admin</Badge>
            )}
          </>
        );
      },
    },
    {
      key: "active",
      label: "Active/In-active",
      render: (value, row) => (
        <div className="d-flex justify-content-center marklab--switch">
          <FormGroup switch>
            <Input
              type="switch"
              checked={row.active}
              onChange={(e) => {
                setStatus(e.target.checked);
                setSelectedProvider(row);
                setPopoverOpen(true);
              }}
            />
          </FormGroup>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (value, row) => (
        <div className="generic-tbl__actions d-flex justify-content-center">
          {/* <ButtonX
            size="sm"
            logo={DeleteLogo}
            logoClass="delete-logo"
            className="btn-delete btn-delete--hover d-flex align-items-center"
            clickHandler={() => {
              setCurrentuserid(row?.id);
              setModal(true);
            }}
          >
            Edit User
          </ButtonX> */}
          <TooltipX text={"Edit User"} id={`${row?.id}a`}>
            <ButtonX
              logoClass="delete-logo"
              id={`tooltip-${row?.id}a`}
              clickHandler={() => {
                localStorage.setItem("redirect", "users");
                handleBusiness(row?.id);
              }}
              className="btn-delete d-flex align-items-center"
            >
              <FiEdit className="me-2" />
            </ButtonX>
          </TooltipX>
        
          
          <TooltipX text={"Delete"} id={`${row?.id}c`}>
            <ButtonX
              logoClass="delete-logo"
              id={`tooltip-${row?.id}c`}
              clickHandler={() =>
                router.push(
                  `/additional-documents/${row.id}?businessid=${row?.business_id}`
                )
              }
              className="btn-delete d-flex align-items-center"
            >
              <FaFileCirclePlus className="me-2" />
            </ButtonX>
          </TooltipX>
        </div>
      ),
    },
  ];

  const UserModal = () => {
    return (
      <Modal
        isOpen={modal}
        toggle={CloseModal}
        backdrop="static"
        keyboard={false}
      >
        <ModalHeader className="create-user--header" toggle={CloseModal}>
          Create User
        </ModalHeader>
        <ModalBody>
          {/* {!currentuserid ? ( */}
          <CreateUser CloseModal={CloseModal} fetchUsers={fetchUsers} />
          {/* ) : (
            <EditUser
              CloseModal={CloseModal}
              fetchUsers={fetchUsers}
              currentuserid={currentuserid}
            /> */}
          {/* )} */}
        </ModalBody>
      </Modal>
    );
  };

  return (
    <>
      <ConfirmationPopover
        loading={loading}
        popoverOpen={popoverOpen}
        togglePopover={togglePopover}
        handleConfirm={handleConfirm}
      />
      <UserModal />
      <section className="data-provider--main">
        <div className="col-lg-12">
          <div className="subheader--sec">
            <SubHeader
              SubHeaderLogo={User}
              headerTitle="Users"
              HeaderText=""
            />
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <ButtonX
              className="create-btn btn-quote btn-quote--hover  d-flex align-items-center justify-content-center"
              size="lg"
              clickHandler={() => setModal(true)}
            >
              Create User
            </ButtonX>
            <GenericField
              type="text"
              name="search"
              value={search}
              placeholder="Search by Name or Email"
              onChange={handleSearchChange}
              className="form-input br-16 pl-38 h-36 offWhite search-icon max-300"
              Icon={AiOutlineSearch}
            />
          </div>
          <TableX
            heading="Users List"
            params={params}
            className="provider-table user--list-tbl generic--tbl"
            columns={columns}
            loading={loading}
            handleSort={handleSort}
            data={userListing?.data ?? []}
          />
          {!loading && userListing?.data?.length > 0 && (
            <div className="data-list--pagination d-flex justify-content-center align-item-center">
              <Pagination
                lastPage={lastPage}
                count={userListing}
                currentPage={currentPage}
                handlePageSize={handlePageSize}
                pageSize={params.pageSize}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  fetchUsers(page, search);
                }}
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
