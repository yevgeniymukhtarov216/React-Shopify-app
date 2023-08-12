import React, {useState, useEffect, useContext} from 'react';
import UserContext from '../context/UserContext';
import './pages.scss';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../../config/Api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import Verified from '../../assests/img/check.png'

const CreateInfluencer = () => {
    const [productName, setProductName] = useState([]);
    const [productIds, setProductIds] = useState([]);
    const [influencerList, setInfluencerList] = useState([]);
    const [campaignName, setCampaignName] = useState('');
    const [selectedDate, setSelectedDate] = useState("");
    const [influencerVisit, setInfluencerVisit] = useState('');
    const [userData, setUserData] = useState([]);
    const [showList, setShowList] = useState(false);
    const [campaignDesc, setCampaignDesc] = useState('');
    const [influenceOffer, setInfluenceOffer] = useState('');
    const [influenceFee, setInfluenceFee] = useState('');
    const [selectedCoupon, setSelectedCoupon] = useState({ name: "", product: "" });
    const [prodList, setProdList] = useState('')
    const [prodDesc, setProdDesc] = useState([]);
    const [showInfluList, setShowInfluList] = useState(true);
    const [showCampaignList, setShowCampaignList] = useState(false);
    const [influForm, setInfluForm] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [prodInfluId, setProdInfluId] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [checkboxStates, setCheckboxStates] = useState({});
    const [selectedCouponProducts, setSelectedCouponProducts] = useState({});
    const [productUrl, setProductUrl] = useState([]);
    const [selectedCoupons, setSelectedCoupons] = useState([]);
    const [prevCouponClicked, setPrevCouponClicked] = useState('');
    const [couponClicked, setCouponClicked] = useState('');
    const [selectedCouponNames, setSelectedCouponNames] = useState([]);
    const [selectedCouponAmounts ,setSelectedCouponAmounts] = useState([]);
    const [isVisitChecked, setIsVisitChecked] = useState(false);
    const [isOfferChecked, setIsOfferChecked] = useState(false);
    const {setDraftList, draftList, campListPending, setCampListPending, countCamp, setCountCamp} = useContext(UserContext);
    const token = localStorage.getItem("Token");
    const [endDate, setEndDate] = useState('');
    const [matchedInfluencerNames, setMatchedInfluencerNames] = useState([]);

    const [couponAmounts, setCouponAmounts] = useState([]);
    const [productDetails, setProductDetails] = useState([]);
    const navigate = useNavigate();
  
    const today = new Date().toISOString().substr(0, 10);
    const {id} = useParams();
  
    const handleBack = () => {
        setShowInfluList(false);
        setShowCampaignList(false);
        setProductName([]);
        setCampaignName('');
        setSelectedDate('');
        setInfluenceOffer('');
        setInfluencerVisit('');
        setProductIds([]);
        setProductDetails([]);
        setSelectedRows([]);
        const initialStates = {};
        influencerList.forEach((list, i) => {
            initialStates[i] = false;
        });
        setCheckboxStates(initialStates);
    };

    const handleCampDesc = (event) => {
        setCampaignDesc(event.target.value);
    }

    const handleInfluBack = () => {
        setInfluForm(false);
        setShowInfluList(true);
        setProductName([]);
        setCampaignName('');
        setSelectedDate('');
        setInfluenceOffer('');
        setInfluencerVisit('');
        setProductIds([]);
        setProductDetails([]);
        setCheckboxStates([]);
        setSelectedRows([]);
    };

    const handleContinue = (i) => {
        const checkboxStateValues = Object.values(checkboxStates);
        console.log("checkboxStateValues", checkboxStateValues)
        setSelectedCouponProducts(checkboxStateValues)
        const allUnchecked = checkboxStateValues.every(value => !value);
        console.log("allUnchecked", allUnchecked)

        if (allUnchecked) {
            toast.warn('Please select at least one influencer', { autoClose: 1000 });
            return;
        }

        setShowInfluList(false);
        setInfluForm(true);
        if(id?.length != 0) {
            axios.get(API.BASE_URL +  'single/' + id + '/', {
                headers: {
 
                    Authorization: `Token ${token}`
 
            }})
            .then(function (response) {
                console.log("Single Market Data" ,response.data.data);
                setCampaignName(response.data.data[0].campaign_name);
                setSelectedDate(response.data.data[0].date);
                setInfluenceOffer(response.data.data[0].offer);
                setInfluencerVisit(response.data.data[0].influencer_visit);
                setUserData(response.data.data[0])
                const products = response.data.data[0].product;
                const productNames = products.map(product => product.product_name);
                const productIds = products.map(product => product.product_id);
                const couponNames = products.flatMap(product => product.coupon_name);
                setProductName(productNames);
				setInfluenceFee(response.data.data[0].influencer_fee)
                setCampaignDesc(response.data.data[0].description)
                setProductIds(productIds);
                setSelectedCouponNames(couponNames);
                setSelectedCouponAmounts(response.data.data[0].product)
            })
            .catch(function (error) {
                console.log(error)
            })
        }
    };

    const handleCampaignNameChange = (event) => {
        setCampaignName(event.target.value);
    }

    const handleInfluencerVisit = (event) => {
        setInfluencerVisit(event.target.value);
        setIsVisitChecked(!isVisitChecked)
    }

    const handleInfluenceOffer = (e) => {
        setInfluenceOffer(e.target.value);
        setIsOfferChecked(!isOfferChecked)
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    }

    const handleEndDate = (event) => {
        setEndDate(event.target.value);
    }

    useEffect(() => {
        setLoading(true);
        axios.get(API.BASE_URL + 'product/list/',{
            headers: {
 
                Authorization: `Token ${token}`
 
            }
        })
        .then(function (response) {
            console.log("Product List", response);
            setProdList(response.data.success.products)
        })
        .catch(function (error) {
            console.log(error);
        })

        axios.get(API.BASE_URL + 'influencer/list/',{
            headers: {
 
                Authorization: `Token ${token}`
 
            }
        })
        .then(function (response) {
            console.log("Influencer List", response.data.data);
            setInfluencerList(response.data.data)
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(() => setLoading(false));
    }, [token])

    const countList = () => {
        axios.get(API.BASE_URL + 'count/',{
            headers: {
                Authorization: 'Token ' + localStorage.getItem('Token')
            }
        })
        .then(function (response) {
            console.log("Count List in New", response);
            setCountCamp(response.data);
            console.log(countCamp)
        })
        .catch(function (error) {
            console.log(error);
        })
    }
    
    const createIfluenceCampaign = (e) => {
        setLoading(true);
        e.preventDefault();
        axios.post(API.BASE_URL + 'inflcampaign/create/', {
            product: productIds,
            campaign_name: campaignName,
            date: selectedDate,
            coupon: selectedCouponNames.toString(),
            offer: influenceOffer,
            product_name: productName,
            product_discount: selectedCouponAmounts,
            influencer_visit: influencerVisit,
            influencer_name: selectedUsersId.toString(),
            influencer_fee: influenceFee,
            description: campaignDesc,
            end_date: endDate
        }, {
            headers: {
 
                Authorization: `Token ${token}`
 
            }
        })
        .then(function (response) {
            console.log("Campaign Saved in Draft", response);
            toast.success("Campaign Saved in Draft!", { autoClose: 1000 });
            setDraftList([...draftList, response.data.product_details])
            setProductName([]);
            setCampaignName('');
            setSelectedDate('');
            setProdDesc('')
            setInfluenceOffer('');
            setInfluencerVisit('');
            setCampaignDesc('')
            setProductIds([]);
            setSelectedCoupon('')
            setSelectedCoupons([])
            setProductDetails([])
            setCouponAmounts('')
            setProductUrl([])
            setIsVisitChecked(false);
            setIsOfferChecked(false);
            setCampaignDesc('')
            countList()
            navigate("/manage");
        })
        .catch(function (error) {
            console.log(error);
            if(error.response.data.campaign_name) {
                toast.warn("Campaign Name may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.influencer_visit) {
                toast.warn("Influencer Visit may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.date) {
                toast.warn("Date may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.offer) {
                toast.warn("Offer may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.product) {
                toast.warn("Please selecta any Product.", { autoClose: 1000 });
            }
            else if(error.response.data.influencer_fee == "Influencer fee must be in positive.") {
                toast.warn("Influencer fee must be in positive.", { autoClose: 1000 });
            }
            else if(error.response.data.influencer_fee) {
                toast.warn("Please add a fee for Influencer.", { autoClose: 1000 });
            }
            else if(error.response.data.product_discount) {
                toast.warn("Please select any value of Product Discount.", { autoClose: 1000 });
            }
            else if(error.response.data.coupon) {
                toast.warn("Coupon may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.error) {
                toast.warn(`Campaign with ${error.response.data.error[0]} already exists`, { autoClose: 1000 });
            }
            else if(error.response.data.description) {
                toast.warn("Description may not be blank.", { autoClose: 1000 });
            }
            else if (error.response.status === 410) {
                const errorNames = error.response.data.error;
                console.log("error.response.data.error", error.response.data.error)
                if (errorNames) {
                    const errorMessages = errorNames.map((errName) => {
                        return errName;
                    });
                    toast.warn("Campaign with " + errorMessages + " already exists", { autoClose: 1000 });
                }
                else {
                    toast.warn("Error occurred. Please try again later", { autoClose: 1000 });
                }
            }
            else {
                toast.warn("Request failed. Please try again later", { autoClose: 1000 });
            }
        })
        .finally(() => setLoading(false));
    }

    const createIfluenceRequest = (e) => {
        setLoading(true);
        e.preventDefault();
        axios.post(API.BASE_URL + 'request/', {
            product: productIds,
            campaign_name: campaignName,
            date: selectedDate,
            coupon: selectedCouponNames.toString(),
            product_name: productName,
            offer: influenceOffer,
            product_discount: selectedCouponAmounts,
            influencer_visit: influencerVisit,
            influencer_name: selectedUsersId.toString(),
            influencer_fee: influenceFee,
            description: campaignDesc,
            end_date: endDate
        }, {
            headers: {
 
                Authorization: `Token ${token}`
 
            }
        })
        .then(function (response) {
            console.log("Created New Campaign", response);
            toast.success("New Campaign Created!", { autoClose: 1000 });
            setCampListPending([...campListPending, response.data.product_details])
            setProductName([]);
            setCampaignName('');
            setProdDesc('')
            setSelectedDate('');
            setInfluenceOffer('');
            setInfluencerVisit('');
            setCampaignDesc('')
            setProductIds([]);
            setSelectedCoupon('')
            setProductDetails([])
            setCouponAmounts('')
            setCampaignDesc('')
            setProductUrl([])
            setSelectedCoupons([])
            setIsVisitChecked(false);
            setIsOfferChecked(false);
            countList()
            navigate("/manage");
        })
        .catch(function (error) {
            console.log(error);
            if(error.response.data.campaign_name) {
                toast.warn("Campaign Name may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.influencer_visit) {
                toast.warn("Influencer Visit may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.date) {
                toast.warn("Date may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.offer) {
                toast.warn("Offer may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.product) {
                toast.warn("Please selecta any Product.", { autoClose: 1000 });
            }
            else if(error.response.data.influencer_fee == "Influencer fee must be in positive.") {
                toast.warn("Influencer fee must be in positive.", { autoClose: 1000 });
            }
            else if(error.response.data.influencer_fee) {
                toast.warn("Please add a fee for Influencer.", { autoClose: 1000 });
            }
            else if(error.response.data.product_discount) {
                toast.warn("Please select any value of Product Discount.", { autoClose: 1000 });
            }
            else if(error.response.data.coupon) {
                toast.warn("Coupon may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.error) {
                toast.warn(`Campaign with ${error.response.data.error[0]} already exists`, { autoClose: 1000 });
            }
            else if(error.response.data.description) {
                toast.warn("Description may not be blank.", { autoClose: 1000 });
            }
            else if (error.response.status === 410) {
                const errorNames = error.response.data.error;
                console.log("error.response.data.error", error.response.data.error)
                if (errorNames) {
                    const errorMessages = errorNames.map((errName) => {
                        return errName;
                    });
                    toast.warn("Campaign with " + errorMessages + " already exists", { autoClose: 1000 });
                }
                else {
                    toast.warn("Error occurred. Please try again later", { autoClose: 1000 });
                }
            }
            else {
                toast.warn("Request failed. Please try again later", { autoClose: 1000 });
            }
            
        })
        .finally(() => setLoading(false));
    }

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
          document.removeEventListener("click", handleClickOutside);
        };
    }, [token]);

    const handleClickOutside = (event) => {
        const input = document.querySelector(".test input");
        const list = document.querySelector(".test ul");
        if (!input?.contains(event.target) && !list?.contains(event.target)) {
          setShowList(false);
        }
    };

    useEffect(() => {
        if (Array.isArray(productName)) {
          setLoading(true);
          let hasCoupons = false;
          Promise.all(
            productName?.map((product) => {
              return axios
                .post(
                  API.BASE_URL + "product/url/",
                  {
                    products: productIds.filter(Boolean).toString(),
                  },
                  {
                    headers: {
                      Authorization: `Token ${token}`,
                    },
                  }
                )
                .then((response) => {
                  console.log("Response 1", response);
                  const influencerIds = response.data.product_details.flatMap(
                    (product) => product.influencer_id
                  );
                  setProdInfluId(influencerIds);
                  setProductUrl(response.data.product_url);
                  const matchedProductDetails = response.data.product_details.filter(
                    (product) =>
                      product.influencer_id.some((id) =>
                        selectedRows.some((row) => row.id === id)
                      )
                  );
      
                  console.log("matchedProductDetails", matchedProductDetails);
                  if (showInfluList === false) {
                    if (matchedProductDetails.length > 0) {
                      hasCoupons = true;
                      setProductDetails(matchedProductDetails);
      
                      const updatedSelectedCouponAmounts = selectedCouponAmounts.filter(
                        (couponAmount) =>
                          productIds.includes(couponAmount.product_id)
                      );
                      setSelectedCouponAmounts(updatedSelectedCouponAmounts);
                      const flattenedInfluencerIds = influencerIds.flat();
                      const influencerCoupons = selectedRows.map((row) => {
                        const index = flattenedInfluencerIds.findIndex(
                          (id) => id === row.id
                        );
                        if (index !== -1) {
                          const couponIndex = index % response.data.coupon_name.length;
                          return response.data.coupon_name[couponIndex];
                        }
                        return null;
                      });
                      console.log("Influencer Coupons", influencerCoupons);
                    }
                  }
                })
                .catch((error) => console.log(error));
            })
          ).finally(() => {
            setLoading(false);
            if (!hasCoupons && productIds?.length > 0 && showInfluList == false) {
              toast.error(
                "No coupons assigned to influencers for the selected products."
              );
            }
          });
        }
    }, [productName, selectedRows, token]);
           
      
    const handleCheckboxChange = (event, row, id) => {
        const checked = event.target.checked;
        setIsChecked(checked);
      
        setCheckboxStates({
          ...checkboxStates,
          [id]: checked
        });
      
        if (checked) {
          setSelectedRows([...selectedRows, row]);
        } else {
          const updatedRows = selectedRows.filter(selectedRow => selectedRow.id !== row.id);
          setSelectedRows(updatedRows);
          const { [id]: removedIndex, ...updatedStates } = checkboxStates;
          setCheckboxStates(updatedStates);
        }
    };

    useEffect(() => {
        const checkbox = document.querySelector('input[type="checkbox"]');
        if (checkbox) {
          setIsChecked(checkbox.checked);
        }
    }, []);

    const selectedUsersId = selectedRows.map(row => row.id);

    useEffect(() => {
        const initialStates = {};
        influencerList.forEach((list, i) => {
            initialStates[list.id] = false;
        });
        setCheckboxStates(initialStates);
    }, [influencerList]);

    useEffect(() => {
        setPrevCouponClicked(couponClicked);
    }, [couponClicked, selectedCoupon]);

    const editCampaign = (event) => {
        console.log("Product ID:");
        event.preventDefault();
        setLoading(true);
        axios.put(API.BASE_URL + 'update/' + id + '/',{
            campaign_name: campaignName,
            description: campaignDesc,
            offer: influenceOffer,
            product_discount: selectedCouponAmounts,
            influencer_fee: influenceFee,
            influencer_name: selectedUsersId.toString(),
            date: selectedDate,
            product_name: productName,
            end_date: endDate
          },{
          headers: {
 
            Authorization: `Token ${token}`
 
          }
        })
        .then(function (response) {
          console.log("EDITED MARKET", response)
          toast.success("Campaign Edited Successfully", { autoClose: 1000 });
          navigate('/manage')
        })
        .catch(function (error) {
          console.log(error);
          if (error.response.status === 410) {
            const errorNames = error.response.data.error;
            console.log("error.response.data.error", error.response.data.error)
                if (errorNames) {
                    const errorMessages = errorNames.map((errName) => {
                        return errName;
                    });
                    toast.warn(errorMessages + " already exists", { autoClose: 1000 });
                }
                else {
                    toast.warn("Error occurred. Please try again later", { autoClose: 1000 });
                }
            }
            if(error.response.data.campaign_name) {
                toast.warn("Campaign Name may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.influencer_visit) {
                toast.warn("Influencer Visit may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.date) {
                toast.warn("Date may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.offer) {
                toast.warn("Offer may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.product) {
                toast.warn("Please selecta any Product.", { autoClose: 1000 });
            }
            else if(error.response.data.influencer_fee == "Influencer fee must be in positive.") {
                toast.warn("Influencer fee must be in positive.", { autoClose: 1000 });
            }
            else if(error.response.data.influencer_fee) {
                toast.warn("Please add a fee for Influencer.", { autoClose: 1000 });
            }
            else if(error.response.data.product_discount) {
                toast.warn("Please select any value of Product Discount.", { autoClose: 1000 });
            }
            else if(error.response.data.error == "Product field may not be blank.") {
                toast.warn("Product field may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.error == "Coupon field may not be blank.") {
                toast.warn("Coupon field may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.coupon) {
                toast.warn("Coupon may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.error) {
                toast.warn(`Campaign with ${error.response.data.error[0]} already exists`, { autoClose: 1000 });
            }
            else if(error.response.data.description) {
                toast.warn("Description may not be blank.", { autoClose: 1000 });
            }
            else {
                toast.warn("Request failed. Please try again later", { autoClose: 1000 });
            }
        })
        .finally(() => setLoading(false));
    }

    const changeStatus = (event) => {
        event.preventDefault();
        setLoading(true);
        axios.put(API.BASE_URL + 'draft/update/' + id + '/',{
            campaign_name: campaignName,
            description: campaignDesc,
            offer: influenceOffer,
            product_discount: selectedCouponAmounts,
            influencer_fee: influenceFee,
            influencer_name: selectedUsersId.toString(),
            date: selectedDate,
            product_name: productName,
            end_date: endDate
          },{
          headers: {
 
            Authorization: `Token ${token}`
 
          }
        })
        .then(function (response) {
          console.log("Changed Status", response)
          toast.success("Status Changed Successfully", { autoClose: 1000 });
          navigate('/manage')
        })
        .catch(function (error) {
          console.log(error);
          
          if (error.response.status === 410) {
            const errorNames = error.response.data.error;
            console.log("error.response.data.error", error.response.data.error)
            if (errorNames) {
                const errorMessages = errorNames.map((errName) => {
                    return errName;
                });
                toast.warn(errorMessages + " already exists", { autoClose: 1000 });
            }
            else {
                toast.warn("Error occurred. Please try again later", { autoClose: 1000 });
            }
        }
        if(error.response.data.campaign_name) {
            toast.warn("Campaign Name may not be blank.", { autoClose: 1000 });
        }
        else if(error.response.data.influencer_visit) {
            toast.warn("Influencer Visit may not be blank.", { autoClose: 1000 });
        }
        else if(error.response.data.date) {
            toast.warn("Date may not be blank.", { autoClose: 1000 });
        }
        else if(error.response.data.offer) {
            toast.warn("Offer may not be blank.", { autoClose: 1000 });
        }
        else if(error.response.data.product) {
            toast.warn("Please selecta any Product.", { autoClose: 1000 });
        }
        else if(error.response.data.influencer_fee == "Influencer fee must be in positive.") {
            toast.warn("Influencer fee must be in positive.", { autoClose: 1000 });
        }
        else if(error.response.data.influencer_fee) {
            toast.warn("Please add a fee for Influencer.", { autoClose: 1000 });
        }
        else if(error.response.data.product_discount) {
            toast.warn("Please select any value of Product Discount.", { autoClose: 1000 });
        }
        else if(error.response.data.error == "Product field may not be blank.") {
            toast.warn("Product field may not be blank.", { autoClose: 1000 });
        }
        else if(error.response.data.error == "Coupon field may not be blank.") {
            toast.warn("Coupon field may not be blank.", { autoClose: 1000 });
        }
        else if(error.response.data.coupon) {
            toast.warn("Coupon may not be blank.", { autoClose: 1000 });
        }
        else if(error.response.data.error) {
            toast.warn(`Campaign with ${error.response.data.error[0]} already exists`, { autoClose: 1000 });
        }
        else if(error.response.data.description) {
            toast.warn("Description may not be blank.", { autoClose: 1000 });
        }
        else {
            toast.warn("Request failed. Please try again later", { autoClose: 1000 });
        }
        })
        .finally(() => setLoading(false));
    }

    useEffect(() => {
        if (Array.isArray(prodInfluId) && Array.isArray(influencerList)) {
          const matchedNames = [];
      
          prodInfluId.forEach((id) => {
            const matchingInfluencers = influencerList.filter(
              (influencer) => influencer.id === id
            );
      
            if (matchingInfluencers.length > 0) {
              const fullname = matchingInfluencers[0].fullname;
              matchedNames.push(fullname);
            }
          });
      
          setMatchedInfluencerNames(matchedNames);
        }
    }, [prodInfluId, influencerList]);

    useEffect(() => {
        if(id?.length != 0) {
            axios.get(API.BASE_URL +  'single/' + id + '/', {
                headers: {
                    Authorization: `Token ${token}`
            }})
            .then(function (response) {
                console.log("Single Market Data" ,response.data.data);
                setCampaignName(response.data.data[0].campaign_name);
                setSelectedDate(response.data.data[0].date);
                setInfluenceOffer(response.data.data[0].offer);
                setInfluencerVisit(response.data.data[0].influencer_visit);
                setUserData(response.data.data[0]);
                setEndDate(response.data.data[0].end_data)
                
                const influencerNames = response.data.data[0].influencer_name;
                console.log("influencerNamesssss", influencerNames);
                const filteredInfluencers = influencerList.filter(influencer =>
                    influencerNames.includes(influencer.id) && !selectedRows.find(row => row.id === influencer.id)
                );
                setSelectedRows(filteredInfluencers);
                console.log("filteredInfluencers", filteredInfluencers);
                const products = response.data.data[0].product;
                console.log("productsproducts",products);
                const productNames = products.map(product => product.product_name);
                const productIds = products.map(product => product.product_id);
                const couponNames = products.flatMap(product => product.coupon_name);
                if(productName !== null) {
                    setProductName(productNames);
                }
                setInfluenceFee(response.data.data[0].influencer_fee);
                setCampaignDesc(response.data.data[0].description);
                setProductIds(productIds);
                setSelectedCouponNames(couponNames);
                setSelectedCouponAmounts(response.data.data[0].product);
    
                const initialStates = {};
                influencerList.forEach((list) => {
                    initialStates[list.id] = false;
                });
                filteredInfluencers.forEach((influencer) => {
                    initialStates[influencer.id] = true;
                });
                setCheckboxStates(initialStates);
    
            })
            .catch(function (error) {
                console.log(error)
            })
        }
    }, [id, influencerList]);

    useEffect(() => {
        if (productName?.length === 0) {
          setProductDetails([]);
        }
    }, [productName]);
    
    console.log("influencerVisit", influencerList);
    console.log("isVisitChecked", isVisitChecked);
    console.log("Details", selectedCouponAmounts);
    console.log("ID", id);
    console.log("Product Name", productName);
    console.log("ProductIds", productIds);
    console.log("checkboxStates", checkboxStates);
    console.log("isChecked", isChecked);
    console.log("selectedRows", selectedRows);
    console.log("selectedCouponProducts", selectedCouponProducts)
    console.log("ProdInfluId", prodInfluId)
    console.log("matchedInfluencerFullNames", matchedInfluencerNames)
    console.log("Product Details", productDetails)

    console.log("endDate", endDate)


  return (
    <div className="campaign-new p-4 page">
        {loading && <div className='d-flex loader-container flex-column'><div className='loader'><span></span></div> <p className='text-white'>Processing...</p></div>}
        <div className="campaign-new-container d-flex flex-column justify-content-start align-items-center">

            {showInfluList && (
                <>
                    <Link to={id?.length > 0 ? '/manage' : '/create'} onClick={handleBack} className="button button-black back w-100 justify-content-start mt-4 mb-5">
                        <FontAwesomeIcon icon={faChevronLeft} style={{ color: "#000", width: "15px", height: "15px", marginRight: 5 }} />
                        Back
                    </Link>
                    <div className='w-100 influencer-list px-5'>
                        <h3>Influencer List</h3>
                        {influencerList.length > 0 ? (
                            <div className='influencer-list-main'>
                                {influencerList?.map((list, i) => (
                                    <div className='influencer-list-container d-flex align-items-center justify-content-between'>
                                        <div className='d-flex align-items-center col-4'>
                                            <input type="checkbox" checked={checkboxStates[list.id] || false} onChange={event => handleCheckboxChange(event, list, list.id)} />
                                            <img src={list.image} alt='profile-pic' />
                                            <div className='ms-4'>
                                                <p className='d-flex align-items-center'>{list.fullname} {list.isverified === true ? <img src={Verified} alt='verified' style={{width: 18, height: 'fit-content', marginLeft: 7}} /> : ""}</p>
                                                <span>@{list.username}</span>
                                            </div>
                                        </div>
                                        <p className='d-flex flex-column align-items-center col-4'><strong>{(list.follower / 1000000).toFixed(2)} M </strong> <span>Followers</span> </p>
                                        <p className='d-flex flex-column align-items-end col-4'><strong>{(list.engagements / 1000000).toFixed(2) + "M"}<span className='ms-1'>({list.engagement_rate.toFixed(2)}%)</span></strong> <span>Engagement</span> </p>
                                    </div>
                                ))}
                            </div>
                        ) : <h2 className='my-4 text-center w-100'>No Influencers</h2>}
                        <button onClick={handleContinue} className='button button-black mx-auto'>
                            Continue
                        </button>
                    </div>
                </>
            )}

            {influForm && (
                <>
                <button onClick={handleInfluBack} className="button button-black back justify-content-start w-100 my-4">
                    <FontAwesomeIcon icon={faChevronLeft} style={{ color: "#000", width: "15px", height: "15px", marginRight: 5 }} />
                    Back
                </button>
                <div className='w-100'>
                    {id?.length > 0 ? (<h3>Edit Campaign for Influencer</h3>) : <h3>Create Campaign for Influencer</h3>}
                    <form action="" className='d-flex flex-wrap justify-content-between mt-5 w-100'>
                        <div className="input-container d-flex flex-column mb-4">
                            <label className="mb-3">Campaign name</label>
                            <input type="text" maxLength='30' onChange={handleCampaignNameChange} value={campaignName} />
                        </div>

                        <div className="input-container d-flex flex-column mb-4">
                            <label className="mb-3">Influencer need to visit you</label>
                            <div className="input d-flex align-items-center">
                                <span className='d-flex align-items-center justify-content-center me-4'>
                                    <input type="radio" id="yes" name="influencerVisit" value="Yes" checked={influencerVisit === "Yes"} onChange={handleInfluencerVisit} />
                                    <label htmlFor="yes">Yes</label>
                                </span>
                                <span className='d-flex align-items-center justify-content-center'>
                                    <input type="radio" id="no" name="influencerVisit" value="No" checked={influencerVisit === "No"} onChange={handleInfluencerVisit} />
                                    <label htmlFor="no">No</label>
                                </span>
                            </div>

                        </div>

                        <div className="input-container d-flex flex-column mb-4">
                            <label className="mb-3">Campaign start date</label>
                            <input type="date" min={today} onChange={handleDateChange} value={selectedDate} />
                        </div>

                        <div className="input-container d-flex flex-column mb-4">
                            <label className="mb-3">Campaign end date</label>
                            <input type="date" min={selectedDate} onChange={handleEndDate} value={endDate} />
                        </div>

                        <div className="input-container d-flex flex-column mb-4">
                            <label className="mb-3">Offer to influencers</label>
                            <div className="input d-flex align-items-center">
                                <span className='d-flex align-items-center justify-content-center me-4'>
                                    <input type="radio" id="percentage" name="influenceOffer" value="percentage" checked={influenceOffer === "percentage"} onChange={handleInfluenceOffer} />
                                    <label htmlFor="percentage">Commission</label>
                                </span>
                                <span className='d-flex align-items-center justify-content-center'>
                                    <input type="radio" id="commission" name="influenceOffer" value="commission" checked={influenceOffer === "commission"} onChange={handleInfluenceOffer} />
                                    <label htmlFor="commission">Fixed Fee</label>
                                </span>
                            </div>
                        </div>

                        <div className="input-container test d-flex flex-column mb-4 drop">
                            <label className="mb-3">Product</label>
                            <input
                                type="text"
                                placeholder="---Select an option---"
                                onClick={() => setShowList(!showList)}
                                value={productName.filter(Boolean).join(", ")}
                                style={productName?.length > 0 ? {fontWeight: 'bold', color: ''} : {}}
                            />
                            {showList && (
                                <ul className="product-list">
                                    {prodList?.length > 0 ? (
                                        prodList?.map((name, i) => (
                                            <li
                                                key={i}
                                                onClick={() => {
                                                    setProductName((prevValues) =>
                                                        prevValues.includes(name.title)
                                                            ? prevValues.filter((value) => value !== name.title)
                                                            : [...prevValues, name.title]
                                                    );
                                                    setProductIds((prevIds) =>
                                                        prevIds.includes(name.id)
                                                            ? prevIds.filter((value) => value !== name.id)
                                                            : [...prevIds, name.id]
                                                    );
                                                    setShowList(false);
                                                }}
                                                className={productName.includes(name.title) ? "active-prod" : ""}
                                            >
                                                {name.title}
                                            </li>
                                        ))
                                    ) : (
                                        "No Products"
                                    )}
                                </ul>
                            )}
                        </div>


                        {influenceOffer.length > 0 ? (
                            <div className="input-container d-flex flex-column mb-4">
                                <label className="mb-3">{influenceOffer === "percentage" ? "Commission (%)" : "Fixed Fee"}</label>
                                <input type="number" onWheel={(e) => e.target.blur()} value={influenceFee} onChange={(e) => {setInfluenceFee(e.target.value)}} />
                            </div>
                        ): ""}

                        {productIds.length > 0 && (
                            <div className="input-container d-flex flex-column mb-4">
                                <label className="mb-3">Product URL</label>
                                <div className='product-urls'>
                                    {productUrl?.map((url, index) => (
                                        <a key={index} href={url} target="_blank">
                                            <FontAwesomeIcon icon={faSearch} style={{ color: "#5172fc", width: "15px", height: "15px", marginRight: 10 }} />
                                            {url}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="input-container d-flex flex-column mb-4">
                            <label className="mb-3">Description</label>
                            <textarea
                                name=""
                                id=""
                                cols="30"
                                onChange={handleCampDesc}
                                value={campaignDesc}
                                // value={prodDesc.map((desc) => desc.description).join('\n')}
                                style={{ color: '#666' }}
                            ></textarea>
                        </div>

                        <div className="input-container d-flex flex-column mb-4 influen-list">
                            <label className="mb-3">Influencer from the list.</label>
                            <div className='selected-influencers'>
                                <ul>
                                    {selectedRows?.map((influ) => {
                                        return(
                                            <li
                                                className='influencer-box d-flex align-items-center px-4'
                                                key={influ.id}
                                            >
                                                <img src={influ.image} alt="influencer" />
                                                <p className="ms-2 d-flex flex-column">
                                                    <span className='text-dark'>{influ.fullname}</span>
                                                    <span>@{influ.username}</span>
                                                </p>
                                                <p className='ms-auto d-flex flex-column'>
                                                    <span className='text-dark'>Followers</span>
                                                    <strong>{(influ.follower / 1000000).toFixed(6)} M</strong>
                                                </p>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                    
                        <div className="input-container d-flex flex-column mb-4 prod-coupons w-100">
                            <label className="mb-3">Product coupons</label>
                            {productDetails?.length > 0 ? (
                                <ul className="coupons coupons-list flex-column">
                                    {productDetails?.map((product, i) => (
                                        <li className='d-flex flex-row align-items-center mb-2'>
                                            {/* <span>{matchedInfluencerNames[i]}</span> */}
                                            <span>{product?.product_name}:- </span>
                                            <div className='d-flex align-items-center'>
                                                {product?.coupon_name?.length > 0 ? (
                                                    product?.coupon_name?.map((coupon, j) => {
                                                        const influencerId = product?.influencer_id[j];
                                                        const couponId = product.coupon_id[j];
                                                        console.log("influencerId influencerId", influencerId)
                                                        const influencerIndex = selectedRows.findIndex(row => row.id === influencerId);
                                                        const influencer = selectedRows[influencerIndex];
                                                        const couponObject = {
                                                            coupon_name: coupon,
                                                            product_name: product.product_name,
                                                            product_id: product.product_id,
                                                            amount: product.amount[j].substring(1),
                                                            influencer_id: product.influencer_id[j],
                                                            discout_type: product.discout_type[j],
                                                            coupon_id: product.coupon_id[j]
                                                        };
                                                        const isCouponSelected = id?.length > 0 ?(
                                                            selectedCouponAmounts.some(selectedCoupon => selectedCoupon.coupon_name && selectedCoupon.coupon_name.includes(String(couponObject.coupon_name)) && selectedCoupon.product_id === couponObject.product_id)
                                                          )
                                                        : (
                                                            selectedCoupons.some(selectedCoupon => selectedCoupon.coupon_name === couponObject.coupon_name && selectedCoupon.product_id === couponObject.product_id)
                                                        );
                                                        const handleClick = () => {
                                                            if (id?.length > 0) {
                                                              console.log("couponObject", couponObject);
                                                              setSelectedCouponAmounts((prevSelectedCouponAmounts) => {
                                                                const existingProductIndex = prevSelectedCouponAmounts.findIndex(
                                                                  (selectedCouponAmount) =>
                                                                    selectedCouponAmount.product_name === product.product_name &&
                                                                    selectedCouponAmount.product_id === product.product_id
                                                                );
                                                          
                                                                if (existingProductIndex !== -1) {
                                                                  const existingProduct = prevSelectedCouponAmounts[existingProductIndex];
                                                          
                                                                  if (
                                                                    existingProduct &&
                                                                    existingProduct.coupon_name &&
                                                                    existingProduct.coupon_name.includes(couponObject.coupon_name)
                                                                  ) {
                                                                      console.log("existingProductexistingProduct", existingProduct)
                                                                    const updatedProduct = {
                                                                        ...existingProduct,
                                                                        coupon_name: existingProduct.coupon_name.filter((name) => name !== couponObject.coupon_name),
                                                                        product_name: product.product_name,
                                                                        product_id: product.product_id,
                                                                        amount: existingProduct.amount.filter((amount) => amount !== couponObject.amount),
                                                                        influencer_id: existingProduct.influencer_id.filter((influencer_id) => influencer_id !== couponObject.influencer_id),
                                                                        discout_type: Array.isArray(existingProduct.discout_type)
                                                                        ? existingProduct.discout_type.filter((discout_type, index) => {
                                                                            const sameCouponName = existingProduct.coupon_name[index] === couponObject.coupon_name;
                                                                            const otherCouponsWithSameType = existingProduct.coupon_name.some((name, i) => i !== index && name === couponObject.coupon_name);
                                                                            return !sameCouponName || otherCouponsWithSameType;
                                                                        })
                                                                        : [],
                                                                          coupon_id: existingProduct.coupon_id.filter((coupon_id) => coupon_id !== couponObject.coupon_id)
                                                                    };
                                                          
                                                                    if (updatedProduct.coupon_name.length === 0) {
                                                                      return prevSelectedCouponAmounts.filter((_, index) => index !== existingProductIndex);
                                                                    }
                                                          
                                                                    return prevSelectedCouponAmounts.map((selectedCouponAmount, index) => {
                                                                      if (index === existingProductIndex) {
                                                                        return updatedProduct;
                                                                      }
                                                                      return selectedCouponAmount;
                                                                    });
                                                                  }
                                                          
                                                                  return prevSelectedCouponAmounts.map((selectedCouponAmount, index) => {
                                                                    if (index === existingProductIndex) {
                                                                      return {
                                                                        ...existingProduct,
                                                                        coupon_name: Array.isArray(existingProduct.coupon_name)
                                                                          ? [...existingProduct.coupon_name, couponObject.coupon_name]
                                                                          : [couponObject.coupon_name],
                                                                        amount: [...existingProduct.amount, couponObject.amount],
                                                                        influencer_id: existingProduct.influencer_id ? [...existingProduct.influencer_id, couponObject.influencer_id] : [couponObject.influencer_id],
                                                                        discout_type: Array.isArray(existingProduct.discout_type)
                                                                        ? [...existingProduct.discout_type, couponObject.discout_type]
                                                                        : [couponObject.discout_type],
                                                                        coupon_id: existingProduct.coupon_id ? [...existingProduct.coupon_id, couponObject.coupon_id] : [couponObject.coupon_id] ,
                                                                      };
                                                                    }
                                                                    return selectedCouponAmount;
                                                                  });
                                                                }
                                                          
                                                                return [
                                                                  ...prevSelectedCouponAmounts,
                                                                  {
                                                                    product_name: product.product_name,
                                                                    product_id: product.product_id,
                                                                    coupon_name: [couponObject.coupon_name],
                                                                    amount: [couponObject.amount],
                                                                    influencer_id: [couponObject.influencer_id],
                                                                    discout_type: [couponObject.discout_type],
                                                                    coupon_id: [couponObject.coupon_id]
                                                                  },
                                                                ];
                                                              });
                                                            }
                                                            
                                                            else {
                                                              const selectedCouponIndex = selectedCoupons.findIndex(
                                                                (selectedCoupon) =>
                                                                  selectedCoupon.coupon_name === couponObject.coupon_name && selectedCoupon.product_id === couponObject.product_id
                                                              );
                                                          
                                                              if (selectedCouponIndex !== -1) {
                                                                setSelectedCoupons((prevSelectedCoupons) =>
                                                                  prevSelectedCoupons.filter((selectedCoupon, index) => index !== selectedCouponIndex)
                                                                );
                                                                setSelectedCouponNames((prevSelectedCouponNames) =>
                                                                  prevSelectedCouponNames.filter((selectedCouponName, index) => index !== selectedCouponIndex)
                                                                );
                                                                setSelectedCouponAmounts((prevSelectedCouponAmounts) => {
                                                                    const updatedSelectedCouponAmounts = [...prevSelectedCouponAmounts];
                                                                    const existingProductIndex = updatedSelectedCouponAmounts.findIndex(
                                                                      (selectedCouponAmount) =>
                                                                        selectedCouponAmount.product_name === product.product_name &&
                                                                        selectedCouponAmount.product_id === product.product_id
                                                                    );
                                                            
                                                                    if (existingProductIndex !== -1) {
                                                                      const existingProduct = updatedSelectedCouponAmounts[existingProductIndex];
                                                                      const couponIndex = existingProduct.coupon_name.findIndex((name) => name === couponObject.coupon_name);
                                                            
                                                                      if (couponIndex !== -1) {
                                                                        existingProduct.coupon_name.splice(couponIndex, 1);
                                                                        existingProduct.amount.splice(couponIndex, 1);
                                                                        existingProduct.discout_type.splice(couponIndex, 1);
                                                            
                                                                        if (existingProduct.coupon_name.length === 0) {
                                                                          updatedSelectedCouponAmounts.splice(existingProductIndex, 1);
                                                                        }
                                                                      }
                                                                    }
                                                            
                                                                    return updatedSelectedCouponAmounts;
                                                                  });
                                                                } else {
                                                                  setSelectedCoupons((prevSelectedCoupons) => [...prevSelectedCoupons, couponObject]);
                                                                  setSelectedCouponNames((prevSelectedCouponNames) => [...prevSelectedCouponNames, couponObject.coupon_name]);
                                                                  setSelectedCouponAmounts((prevSelectedCouponAmounts) => {
                                                                    const existingProductIndex = prevSelectedCouponAmounts.findIndex(
                                                                      (selectedCouponAmount) =>
                                                                        selectedCouponAmount.product_name === product.product_name &&
                                                                        selectedCouponAmount.product_id === product.product_id
                                                                    );
                                                            
                                                                    if (existingProductIndex !== -1) {
                                                                      const existingProduct = prevSelectedCouponAmounts[existingProductIndex];
                                                                      return prevSelectedCouponAmounts.map((selectedCouponAmount, index) => {
                                                                        if (index === existingProductIndex) {
                                                                          return {
                                                                            ...existingProduct,
                                                                            coupon_name: [...existingProduct.coupon_name, couponObject.coupon_name],
                                                                            amount: [...existingProduct.amount, couponObject.amount],
                                                                            discout_type:Array.isArray(existingProduct.discout_type)
                                                                            ? [...existingProduct.discout_type, couponObject.discout_type]
                                                                            : [couponObject.discout_type],
                                                                            influencer_id: [...existingProduct.influencer_id, couponObject.influencer_id],
                                                                            coupon_id: [...existingProduct.coupon_id, couponObject.coupon_id]
                                                                          };
                                                                        }
                                                                        return selectedCouponAmount;
                                                                      });
                                                                    }
                                                            
                                                                    return [
                                                                      ...prevSelectedCouponAmounts,
                                                                      {
                                                                        product_name: product.product_name,
                                                                        product_id: product.product_id,
                                                                        coupon_name: [couponObject.coupon_name],
                                                                        amount: [couponObject.amount],
                                                                        influencer_id: [couponObject.influencer_id],
                                                                        discout_type: [couponObject.discout_type],
                                                                        coupon_id: [couponObject.coupon_id]
                                                                      },
                                                                    ];
                                                                  });
                                                                }
                                                              }
                                                        };
                                                            
                                                          
                                                            if (selectedRows.some(row => row.id === influencerId) && productName) {
                                                                return (
                                                                    <div className='d-flex flex-column justify-content-center align-items-center'>
                                                                    <span className='text-center' style={{margin: '0 10px'}}>{influencer?.fullname}</span>
                                                                    <p
                                                                        key={coupon}
                                                                        className={`d-flex flex-column mb-0 ${isCouponSelected ? 'selected' : ''}`}
                                                                        onClick={handleClick}
                                                                    >
                                                                        {coupon} - {Math.abs(parseInt(product.amount[j]))}
                                                                        {product.discout_type[j] !== 'fixed_amount' ? "%" : "د.إ"}
                                                                    </p>
                                                                    </div>
                                                                );
                                                              }
                                                    
                                                              return null;
                                                            })
                                                ) : <h5 className='fw-light mb-0 ms-2'>No Coupons</h5>}
                                            </div>
                                        </li>
                                    ))
                                    } 
                                </ul>
                            ): (
                                <p className='align-items-start'>No Coupon Available</p>
                                )}
                        </div>

                        <div className="buttons d-flex justify-content-center">
                            {id?.length > 0 ? (
                                <>
                                <button className='button button-black' onClick={(e) => {editCampaign(e)}}>Update Campaign</button>
                                {userData?.draft_status == true && (
                                    <button className='button ms-4' onClick={(e) => {changeStatus(e)}}>Change Status to Pending</button>
                                )}
                                </>
                            ):
                            <>
                            <button className='button button-black' onClick={createIfluenceCampaign}>Save in draft</button>
                            <button className='button ms-4' onClick={(e) => createIfluenceRequest(e)}>Send Request</button></>}
                            
                            
                        </div>
                    </form>
                </div>
                </>
            )}
        </div>
    </div>
  );
}

export default CreateInfluencer;