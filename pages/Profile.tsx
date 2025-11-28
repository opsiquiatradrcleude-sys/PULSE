import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Profile } from '../types';
import { generateBioAnalysis } from '../services/geminiService';
import { SparklesIcon, XIcon, StarIcon } from '../components/Icons';

const ProfileView: React.FC = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (location.state?.profile) {
            setProfile(location.state.profile);
        } else if (id) {
            // Fallback mock fetch
            setProfile({
                id: id,
                name: 'Clara',
                age: 28,
                headline: 'Coffee & Code ☕️',
                bio: 'Software engineer by day, amateur chef by night. Looking for someone who knows the difference between Java and JavaScript.',
                photos: ['https://picsum.photos/400/600?random=1'],
                verified: true,
                distance: 3
            });
        } else {
            // Own profile
             setProfile({
                id: 'me',
                name: 'You',
                age: 25,
                headline: 'Edit Profile',
                bio: 'Just here to see how this app works.',
                photos: ['https://picsum.photos/400/600?grayscale'],
                verified: true,
                distance: 0
            });
        }
    }, [id, location]);

    const handleAnalyze = async () => {
        if (!profile) return;
        setLoadingAnalysis(true);
        const result = await generateBioAnalysis(profile.bio);
        setAnalysis(result);
        setLoadingAnalysis(false);
    };

    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && profile) {
            const newPhotos = Array.from(event.target.files).map(file => URL.createObjectURL(file));
            setProfile({ ...profile, photos: [...profile.photos, ...newPhotos] });
        }
    };

    const removePhoto = (index: number) => {
        if (!profile) return;
        const newPhotos = profile.photos.filter((_, i) => i !== index);
        setProfile({ ...profile, photos: newPhotos });
    };

    const setPrimaryPhoto = (index: number) => {
        if (!profile) return;
        // Move the selected photo to the beginning of the array
        const photos = [...profile.photos];
        const [selected] = photos.splice(index, 1);
        photos.unshift(selected);
        setProfile({ ...profile, photos });
    };

    const saveProfile = () => {
        setIsEditing(false);
        // Here you would typically send updated profile data to your backend
    };

    if (!profile) return <div className="p-10 text-center">Loading...</div>;

    const isOwnProfile = profile.id === 'me';

    if (isEditing) {
        return (
            <div className="min-h-full bg-pulse-dark p-6 pb-24 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
                    <button onClick={saveProfile} className="text-pulse-primary font-bold text-lg hover:text-red-400 transition">Done</button>
                </div>

                <div className="space-y-6">
                    {/* Photos Section */}
                    <div>
                        <label className="block text-zinc-400 text-sm font-bold mb-3">Photos</label>
                        <div className="grid grid-cols-3 gap-3">
                            {profile.photos.map((photo, index) => (
                                <div key={index} className="relative aspect-[3/4] group">
                                    <img 
                                        src={photo} 
                                        className={`w-full h-full object-cover rounded-xl transition-all duration-300 ${index === 0 ? 'border-2 border-pulse-primary ring-2 ring-pulse-primary/20' : 'border border-zinc-800'}`} 
                                        alt={`Photo ${index + 1}`} 
                                    />
                                    
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); removePhoto(index); }}
                                        className="absolute -top-2 -right-2 bg-zinc-800 text-white rounded-full p-1.5 shadow-md border border-zinc-700 hover:bg-red-500 hover:border-red-500 transition z-20"
                                    >
                                        <XIcon className="w-3 h-3" />
                                    </button>

                                    {/* Primary Photo Controls */}
                                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent rounded-b-xl flex justify-center z-10">
                                        {index === 0 ? (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-pulse-primary bg-black/60 px-2 py-1 rounded-full border border-pulse-primary/30">
                                                <StarIcon className="w-3 h-3 fill-current" />
                                                Primary
                                            </span>
                                        ) : (
                                            <button 
                                                onClick={() => setPrimaryPhoto(index)}
                                                className="text-[10px] font-bold text-white bg-white/20 hover:bg-pulse-primary backdrop-blur-sm px-2 py-1 rounded-full border border-white/10 transition"
                                            >
                                                Make Primary
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-[3/4] rounded-xl border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-500 hover:bg-zinc-800/50 transition cursor-pointer"
                            >
                                <span className="text-3xl font-light mb-1">+</span>
                                <span className="text-xs font-semibold">Add Photo</span>
                            </button>
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handlePhotoUpload} 
                            multiple 
                            accept="image/*" 
                            className="hidden" 
                        />
                        <p className="text-xs text-zinc-500 mt-2">The first photo will be your main profile picture.</p>
                    </div>

                    {/* Text Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-zinc-400 text-sm font-bold mb-2">Name</label>
                            <input 
                                value={profile.name}
                                onChange={(e) => setProfile({...profile, name: e.target.value})}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-pulse-primary focus:ring-1 focus:ring-pulse-primary outline-none transition"
                                placeholder="Your name"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-zinc-400 text-sm font-bold mb-2">Age</label>
                             <input 
                                type="number"
                                value={profile.age}
                                onChange={(e) => setProfile({...profile, age: parseInt(e.target.value) || 0})}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-pulse-primary focus:ring-1 focus:ring-pulse-primary outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="block text-zinc-400 text-sm font-bold mb-2">Headline</label>
                            <input 
                                value={profile.headline}
                                onChange={(e) => setProfile({...profile, headline: e.target.value})}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-pulse-primary focus:ring-1 focus:ring-pulse-primary outline-none transition"
                                placeholder="Short & catchy description"
                            />
                        </div>

                        <div>
                            <label className="block text-zinc-400 text-sm font-bold mb-2">Bio</label>
                            <textarea 
                                value={profile.bio}
                                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white h-32 focus:border-pulse-primary focus:ring-1 focus:ring-pulse-primary outline-none transition resize-none"
                                placeholder="Tell people about yourself..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // View Mode
    return (
        <div className="min-h-full bg-pulse-dark relative pb-24">
            {/* Image Header */}
            <div className="h-96 w-full relative">
                <img src={profile.photos[0]} className="w-full h-full object-cover" alt={profile.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-pulse-dark to-transparent"></div>
                <button onClick={() => navigate(-1)} className="absolute top-4 left-4 p-2 bg-black/50 rounded-full text-white backdrop-blur-md hover:bg-black/70 transition">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                {isOwnProfile && (
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="absolute top-4 right-4 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-bold hover:bg-white/20 transition"
                    >
                        Edit
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="px-6 -mt-20 relative z-10">
                <div className="flex items-end justify-between mb-2">
                    <h1 className="text-4xl font-bold text-white">{profile.name}, {profile.age}</h1>
                    {profile.verified && <span className="bg-blue-500 text-white p-1 rounded-full mb-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></span>}
                </div>
                
                <div className="flex items-center text-zinc-400 text-sm mb-6">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    {profile.distance > 0 ? `${profile.distance} km away` : 'Nearby'}
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-5 mb-6">
                    <h3 className="text-pulse-primary font-bold uppercase tracking-wider text-xs mb-2">Bio</h3>
                    <p className="text-zinc-200 leading-relaxed text-lg font-light">"{profile.bio}"</p>
                </div>

                {/* AI Analysis Section */}
                {!isOwnProfile && (
                    <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-2xl p-5 mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-indigo-400 font-bold flex items-center gap-2 text-sm">
                                <SparklesIcon className="w-4 h-4" /> AI Compatibility
                            </h3>
                            {!analysis && (
                                <button 
                                    onClick={handleAnalyze} 
                                    disabled={loadingAnalysis}
                                    className="text-xs bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-full text-white transition disabled:opacity-50"
                                >
                                    {loadingAnalysis ? 'Analyzing...' : 'Analyze Bio'}
                                </button>
                            )}
                        </div>
                        {analysis ? (
                             <div className="text-sm text-indigo-100/90 whitespace-pre-wrap leading-relaxed animate-fade-in">
                                {analysis}
                             </div>
                        ) : (
                            <p className="text-xs text-indigo-200/50 italic">
                                Tap to reveal personality insights and potential red flags based on their bio.
                            </p>
                        )}
                    </div>
                )}

                <h3 className="text-white font-bold text-lg mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2 mb-8">
                    {['Coffee', 'Coding', 'Travel', 'Sushi', 'Gym'].map(tag => (
                        <span key={tag} className="px-4 py-1.5 rounded-full border border-zinc-700 bg-zinc-900 text-zinc-300 text-sm">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Additional Photos for View Mode */}
                {profile.photos.length > 1 && (
                    <div className="mb-8">
                         <h3 className="text-white font-bold text-lg mb-3">More Photos</h3>
                         <div className="grid grid-cols-2 gap-2">
                             {profile.photos.slice(1).map((photo, i) => (
                                 <img key={i} src={photo} className="w-full aspect-[3/4] object-cover rounded-xl" alt={`Gallery ${i}`} />
                             ))}
                         </div>
                    </div>
                )}

                {isOwnProfile && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="w-full py-4 bg-zinc-800 rounded-xl font-bold text-white hover:bg-zinc-700 transition"
                    >
                        Edit Profile
                    </button>
                )}
            </div>
        </div>
    );
}

export default ProfileView;