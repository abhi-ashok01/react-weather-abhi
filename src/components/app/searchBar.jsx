import { MapPinned, SearchIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import debounce from 'lodash.debounce';
import GetLocationData from "../../services/locationService";
import { Input } from "../ui/input";

const SearchBar = ({setSelected}) => {
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    const [current, setCurrent] = useState();
    const [input, setInput] = useState('');

    const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);

    useEffect(() => {
        return () => {
            debouncedhandleChange.cancel();
        };
    });

    const handleChange = async(e) => {
        setInput(e.target.value);
        const data = await GetLocationData(e.target.value)
        if(data && data.results) {
            setSuggestions(data.results);
        } else {
            setSuggestions([]);
            setSelectedOptionIndex(-1);
        }        
    }
    
    const debouncedhandleChange = useMemo(() => {
        return debounce(handleChange, 300);
    }, []);

    const handleSelect = () => {
        setCurrent(suggestions[selectedOptionIndex])
        setSelected(suggestions[selectedOptionIndex])
        setVisible(false);
    }

    const handleOptionClick = (index) => {
        setCurrent(suggestions[index]);
        setSelected(suggestions[index])
        setSelectedOptionIndex(index);
        setVisible(false);
    }

    const handleKeyDown = (e) => {
        if(!suggestions || !suggestions.length > 0) {
            return;
        }
        if(e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter') {
            e.preventDefault();
            switch(e.key) {
                case 'ArrowUp':
                    if(selectedOptionIndex > 0) {
                        setSelectedOptionIndex(selectedOptionIndex - 1);
                    } else {
                        setSelectedOptionIndex(suggestions.length - 1);
                    }
                    break;
                case 'ArrowDown':
                    if(selectedOptionIndex === (suggestions.length - 1)) {
                        setSelectedOptionIndex(0);
                    } else {
                        setSelectedOptionIndex(selectedOptionIndex + 1);
                    }
                    break;
                case 'Enter':
                    handleSelect();
                    break;
                default:
                    break;
            }
        }
    }

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);

    function useOutsideAlerter(ref) {
        useEffect(() => {
          function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
              setVisible(false);
            }
          }
          // Bind the event listener
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
          };
        }, [ref]);
    }

    return(
        <div className="relative" ref={wrapperRef}>
            <div className="relative backdrop-blur-xl">
                <SearchIcon className="absolute left-0 top-4 md:top-2 h-6 w-6 md:h-8 md:w-8 text-foreground"/>
                <Input
                onFocus={() => setVisible(true)}
                spellCheck="false"
                autoCapitalize="on"
                type="text"
                autoComplete="off"
                placeholder="Search your city..."
                onKeyDown={handleKeyDown}
                onChange={debouncedhandleChange}
                className="text-foreground outline-none text-xl md:text-2xl lg:text-3xl bg-transparent border-b py-6 pl-10 pr-2"/>
            </div>
            
            {/* options */}
            {   visible &&
                <div className="absolute w-full text-foreground pt-1" data-var="search-dropdown">
                    {
                        suggestions.map((item,index) => {
                            return(
                                <div onClick={() => handleOptionClick(index)} key={index} className={`border py-2 px-4 flex items-center gap-4 backdrop-blur-xl ${selectedOptionIndex === index && 'bg-white/20'}`}>
                                    <MapPinned className="h-6 w-6"/>
                                    <div className="">
                                        <div className="text-lg">{item.name}, {item.country}</div>
                                        <div className="text-sm">{item.admin3 && `${item.admin3}, `}{item.admin2 && ` ${item.admin2}, `}{item.admin1 && `${item.admin1}`}</div>
                                    </div>
                                    
                                </div>
                            )
                        })
                    }
                </div>
            }
        </div>
    )
}

export default SearchBar;