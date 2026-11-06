import {
  Activity, AlertCircle, AlertTriangle, ArrowDown, ArrowLeft, ArrowRight, ArrowUp,
  ArrowUpDown, ArrowUpRight, Award, Baby, BadgeCheck, Banknote, BarChart3, Bell,
  BookMarked, BookOpen, Bus, Calendar, CalendarClock, CalendarDays, CalendarOff,
  CalendarX, Check, CheckCheck, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  CircleHelp, CircleUser, ClipboardCheck, ClipboardList, Clock, Compass, CreditCard,
  Download, Dumbbell, ExternalLink, Eye, EyeOff, FileBadge, FileCheck,
  FileText, Filter, FlaskConical, FolderOpen, Globe, GraduationCap, Handshake,
  Heart, HeartPulse, History, Home, IdCard, Image, Info, KeyRound,
  Landmark, Languages, LayoutDashboard, Library, LifeBuoy, Lightbulb, ListChecks,
  Loader2, Lock, LogOut, Mail, MailCheck, MapPin, Menu, MessageSquare,
  MessageSquareWarning, Microscope, Monitor, Music, NotebookPen, Package, Palette,
  Pencil, Phone, Plus, Printer, Quote, RefreshCw, Receipt, School, Search, Send,
  Settings, Shield, ShieldCheck, SlidersHorizontal, Snowflake, Sparkles, Star,
  Sun, Target, Trash2, TrendingUp, Trophy, User, UserRound, Users,
  UsersRound, Wallet, Wrench, X, XCircle,
} from 'lucide-react'

// Custom SVG components for brand/social icons no longer present in lucide-react
export function FacebookIcon({ size = 18, className, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

export function TwitterIcon({ size = 18, className, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}

export function InstagramIcon({ size = 18, className, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

export function YoutubeIcon({ size = 18, className, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  )
}

const map = {
  Activity, AlertCircle, AlertTriangle, ArrowDown, ArrowLeft, ArrowRight, ArrowUp,
  ArrowUpDown, ArrowUpRight, Award, Baby, BadgeCheck, Banknote, BarChart3, Bell,
  BookMarked, BookOpen, Bus, Calendar, CalendarClock, CalendarDays, CalendarOff,
  CalendarX, Check, CheckCheck, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  CircleHelp, CircleUser, ClipboardCheck, ClipboardList, Clock, Compass, CreditCard,
  Download, Dumbbell, ExternalLink, Eye, EyeOff, FileBadge, FileCheck,
  FileText, Filter, FlaskConical, FolderOpen, Globe, GraduationCap, Handshake,
  Heart, HeartPulse, History, Home, IdCard, Image, Info, KeyRound,
  Landmark, Languages, LayoutDashboard, Library, LifeBuoy, Lightbulb, ListChecks,
  Loader2, Lock, LogOut, Mail, MailCheck, MapPin, Menu, MessageSquare,
  MessageSquareWarning, Microscope, Monitor, Music, NotebookPen, Package, Palette,
  Pencil, Phone, Plus, Printer, Quote, RefreshCw, Receipt, School, Search, Send,
  Settings, Shield, ShieldCheck, SlidersHorizontal, Snowflake, Sparkles, Star,
  Sun, Target, Trash2, TrendingUp, Trophy, User, UserRound, Users,
  UsersRound, Wallet, Wrench, X, XCircle,
  Facebook: FacebookIcon,
  Twitter: TwitterIcon,
  Instagram: InstagramIcon,
  Youtube: YoutubeIcon,
}

export default function Icon({ name, size = 18, className, ...props }) {
  const Component = map[name] || CircleHelp
  return <Component size={size} className={className} {...props} />
}
