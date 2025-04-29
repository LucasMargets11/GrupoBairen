import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { User, Menu, X, LogOut, Building2, LayoutDashboard } from 'lucide-react';
import Button from './UI/Button';
import LoginModal from './Auth/LoginModal';
import { supabase } from '../lib/supabase';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = async (email: string, password: string, remember: boolean) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    setLoginModalOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navLinkClass = "text-sm font-medium px-3 py-2 transition-colors duration-200";
  const activeNavClass = "text-blue-900";
  const inactiveNavClass = isScrolled ? "text-gray-800 hover:text-blue-900" : "text-white hover:text-blue-100";

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-3' 
          : 'bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <Building2 
            size={32}
            className={`transition-colors duration-300 ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}
          />
          <span className={`ml-2 text-xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
            GrupoBairen
          </span>
        </Link>

        <button 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X size={24} className={isScrolled ? 'text-gray-900' : 'text-white'} />
          ) : (
            <Menu size={24} className={isScrolled ? 'text-gray-900' : 'text-white'} />
          )}
        </button>
        
        <nav className="hidden md:flex items-center space-x-1">
          <NavLink 
            to="/" 
            end
            className={({ isActive }) => 
              `${navLinkClass} ${isActive ? activeNavClass : inactiveNavClass}`
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/properties" 
            className={({ isActive }) => 
              `${navLinkClass} ${isActive ? activeNavClass : inactiveNavClass}`
            }
          >
            Properties
          </NavLink>
          <NavLink 
            to="/agents" 
            className={({ isActive }) => 
              `${navLinkClass} ${isActive ? activeNavClass : inactiveNavClass}`
            }
          >
            Agents
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => 
              `${navLinkClass} ${isActive ? activeNavClass : inactiveNavClass}`
            }
          >
            About
          </NavLink>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => 
              `${navLinkClass} ${isActive ? activeNavClass : inactiveNavClass}`
            }
          >
            Contact
          </NavLink>
          {user && (
            <NavLink 
              to="/admin/properties" 
              className={({ isActive }) => 
                `${navLinkClass} ${isActive ? activeNavClass : inactiveNavClass} flex items-center`
              }
            >
              <LayoutDashboard size={16} className="mr-1" />
              Admin
            </NavLink>
          )}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <span className={`text-sm ${isScrolled ? 'text-gray-600' : 'text-white'}`}>
                {user.email}
              </span>
              <Button
                variant="text"
                className={isScrolled ? 'text-gray-800' : 'text-white'}
                onClick={handleLogout}
              >
                <LogOut size={18} className="mr-1" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="text"
                className={isScrolled ? 'text-gray-800' : 'text-white'}
                onClick={() => setLoginModalOpen(true)}
              >
                <User size={18} className="mr-1" />
                Sign In
              </Button>
              <Button 
                variant={isScrolled ? 'primary' : 'outline'} 
                className={!isScrolled ? 'bg-transparent text-white border-white hover:bg-white/10' : ''}
              >
                List Property
              </Button>
            </>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t">
          <div className="container mx-auto px-4 py-3 flex flex-col">
            <NavLink 
              to="/" 
              end
              className={({ isActive }) => 
                `py-3 border-b border-gray-100 ${isActive ? 'text-blue-900 font-medium' : 'text-gray-800'}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink 
              to="/properties" 
              className={({ isActive }) => 
                `py-3 border-b border-gray-100 ${isActive ? 'text-blue-900 font-medium' : 'text-gray-800'}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Properties
            </NavLink>
            <NavLink 
              to="/agents" 
              className={({ isActive }) => 
                `py-3 border-b border-gray-100 ${isActive ? 'text-blue-900 font-medium' : 'text-gray-800'}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Agents
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                `py-3 border-b border-gray-100 ${isActive ? 'text-blue-900 font-medium' : 'text-gray-800'}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({ isActive }) => 
                `py-3 border-b border-gray-100 ${isActive ? 'text-blue-900 font-medium' : 'text-gray-800'}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </NavLink>
            {user && (
              <NavLink 
                to="/admin/properties" 
                className={({ isActive }) => 
                  `py-3 border-b border-gray-100 flex items-center ${isActive ? 'text-blue-900 font-medium' : 'text-gray-800'}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard size={16} className="mr-2" />
                Admin Dashboard
              </NavLink>
            )}
            <div className="flex mt-4 space-x-2">
              {user ? (
                <Button variant="outline" size="sm" className="flex-1" onClick={handleLogout}>
                  <LogOut size={16} className="mr-1" />
                  Sign Out
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setLoginModalOpen(true);
                    }}
                  >
                    <User size={16} className="mr-1" />
                    Sign In
                  </Button>
                  <Button variant="primary" size="sm" className="flex-1">
                    List Property
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </header>
  );
};

export default Header;