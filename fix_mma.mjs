import fs from 'fs';
import path from 'path';

const files = [
  'app/sports/mma/page.tsx',
  'app/sports/mma/ufc/page.tsx',
  'app/sports/mma/pfl/page.tsx',
  'app/sports/mma/lfa/page.tsx',
  'app/sports/mma/bellator/page.tsx',
  'app/sports/mma/one-championship/page.tsx',
];

function removeOldLiveBlock(content) {
  // Remove everything between @REMOVE_OLD_LIVE_BLOCK@ marker and {/* Top Bet Boosts Section */}
  const startMarker = '          {/* @REMOVE_OLD_LIVE_BLOCK@ */}';
  const endMarker = '          {/* Top Bet Boosts Section */}';
  
  const startIdx = content.indexOf(startMarker);
  const endIdx = content.indexOf(endMarker);
  
  if (startIdx !== -1 && endIdx !== -1) {
    content = content.substring(0, startIdx) + '\n' + content.substring(endIdx);
  }
  
  return content;
}

function stripNonMoneylineMarkets(content) {
  // Remove Spread market lines
  content = content.replace(/\s*\{ title: 'Spread'[^}]*\}[^}]*\},?\s*\n/g, '\n');
  // Remove Total market lines  
  content = content.replace(/\s*\{ title: 'Total'[^}]*\}[^}]*\},?\s*\n/g, '\n');
  // Remove First Half Moneyline lines
  content = content.replace(/\s*\{ title: 'First Half Moneyline'[^}]*\}[^}]*\},?\s*\n/g, '\n');
  // Remove Q1 Spread lines
  content = content.replace(/\s*\{ title: 'Q1 Spread'[^}]*\}[^}]*\},?\s*\n/g, '\n');
  return content;
}

function replaceLiveEventsSection(content) {
  // Find the Live Events section and replace it with card grid
  const liveStart = content.indexOf('{/* Live Events Section');
  if (liveStart === -1) return content;
  
  // Find the line start
  const lineStart = content.lastIndexOf('\n', liveStart) + 1;
  
  // Find the mb-8 div start
  const mb8Start = content.indexOf('<div className="mb-8">', liveStart);
  if (mb8Start === -1) return content;
  
  // Count div open/close to find the end of this section
  let depth = 0;
  let i = mb8Start;
  let foundStart = false;
  while (i < content.length) {
    if (content.substring(i, i + 4) === '<div') {
      depth++;
      foundStart = true;
    }
    if (content.substring(i, i + 6) === '</div>') {
      depth--;
      if (foundStart && depth === 0) {
        // Found the end
        const sectionEnd = i + 6;
        const newSection = `{/* Live Events Section - MMA Fight Cards */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white pl-2">Live</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50">Events ordered by: <span className="font-semibold text-white">Popularity</span></span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/5 border border-white/20 rounded-small cursor-pointer transition-colors duration-300"
                    >
                      <IconFilter className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    sideOffset={5}
                    className="w-[180px] bg-[#2d2d2d] border-white/10 z-[120]"
                    style={{ zIndex: 120 }}
                  >
                    {eventOrderOptions.map((option) => (
                      <DropdownMenuItem 
                        key={option.value}
                        onClick={() => setEventOrderBy(option.value)}
                        className={cn(
                          "text-white/70 hover:text-white hover:bg-white/5 cursor-pointer",
                          eventOrderBy === option.value && "bg-white/10 text-white"
                        )}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className={cn("grid gap-3", isMobile ? "grid-cols-1" : "grid-cols-2")}>
              {filteredLiveEvents.map((event) => {
                const moneylineMarket = event.markets.find((m: any) => m.title === 'Moneyline')
                const fighter1Odds = moneylineMarket?.options?.[0]
                const fighter2Odds = moneylineMarket?.options?.[1]
                
                return (
                  <div key={event.id} className="bg-white/5 border border-white/10 rounded-small p-3 hover:bg-white/[0.07] transition-colors cursor-pointer">
                    {/* Card Header - League & Live Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <IconTrophy className="w-3 h-3 text-white/50" />
                        <span className="text-[10px] text-white/70 font-medium">{event.league}</span>
                        <span className="text-[10px] text-white/40">|</span>
                        <span className="text-[10px] text-white/50">{event.country}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5 bg-[#ee3536]/20 border border-[#ee3536]/50 rounded px-1.5 py-0.5">
                          <div className="w-1.5 h-1.5 bg-[#ee3536] rounded-full animate-pulse"></div>
                          <span className="text-[9px] font-semibold text-[#ee3536]">LIVE</span>
                        </div>
                        <span className="text-[10px] text-[#ee3536] font-medium">{event.startTime}</span>
                      </div>
                    </div>
                    
                    {/* Fighter 1 Row */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-[12px] font-semibold text-white truncate">{event.team1}</span>
                      </div>
                      {fighter1Odds && (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            addBetToSlip(event.id, \`\${event.team1} v \${event.team2}\`, 'Moneyline', fighter1Odds.label, fighter1Odds.odds)
                          }}
                          className={cn(
                            "ml-3 rounded-small w-[72px] h-[36px] flex flex-col items-center justify-center transition-colors cursor-pointer flex-shrink-0",
                            isBetSelected(event.id, 'Moneyline', fighter1Odds.label)
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "bg-white/10 hover:bg-white/20 text-white"
                          )}
                          onMouseEnter={(e) => {
                            if (!isBetSelected(event.id, 'Moneyline', fighter1Odds.label)) {
                              e.currentTarget.style.backgroundColor = brandPrimary
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isBetSelected(event.id, 'Moneyline', fighter1Odds.label)) {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                            }
                          }}
                        >
                          <div className="text-[10px] text-white/60 leading-none mb-0.5">{fighter1Odds.label}</div>
                          <div className="text-xs font-bold leading-none">{fighter1Odds.odds}</div>
                        </button>
                      )}
                      <IconChevronRight className="w-3.5 h-3.5 text-white/30 ml-2 flex-shrink-0" />
                    </div>
                    
                    {/* Fighter 2 Row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-[12px] font-semibold text-white truncate">{event.team2}</span>
                      </div>
                      {fighter2Odds && (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            addBetToSlip(event.id, \`\${event.team1} v \${event.team2}\`, 'Moneyline', fighter2Odds.label, fighter2Odds.odds)
                          }}
                          className={cn(
                            "ml-3 rounded-small w-[72px] h-[36px] flex flex-col items-center justify-center transition-colors cursor-pointer flex-shrink-0",
                            isBetSelected(event.id, 'Moneyline', fighter2Odds.label)
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "bg-white/10 hover:bg-white/20 text-white"
                          )}
                          onMouseEnter={(e) => {
                            if (!isBetSelected(event.id, 'Moneyline', fighter2Odds.label)) {
                              e.currentTarget.style.backgroundColor = brandPrimary
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isBetSelected(event.id, 'Moneyline', fighter2Odds.label)) {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                            }
                          }}
                        >
                          <div className="text-[10px] text-white/60 leading-none mb-0.5">{fighter2Odds.label}</div>
                          <div className="text-xs font-bold leading-none">{fighter2Odds.odds}</div>
                        </button>
                      )}
                      <div className="w-3.5 ml-2 flex-shrink-0" />
                    </div>
                    
                    {/* Moneyline Label */}
                    <div className="text-[10px] text-white/40 text-center border-t border-white/5 pt-2">Moneyline</div>
                  </div>
                )
              })}
            </div>
          </div>`;
        
        content = content.substring(0, lineStart) + '          ' + newSection + '\n          \n' + content.substring(sectionEnd);
        break;
      }
    }
    i++;
  }
  
  return content;
}

function replaceUpcomingEventsSection(content) {
  // Find the Upcoming Events section and replace it with card grid
  const upcomingStart = content.indexOf('{/* Upcoming Events');
  if (upcomingStart === -1) return content;
  
  // Find the line start
  const lineStart = content.lastIndexOf('\n', upcomingStart) + 1;
  
  // Find the mb-8 div start
  const mb8Start = content.indexOf('<div className="mb-8">', upcomingStart);
  if (mb8Start === -1) return content;
  
  // Count div open/close to find the end of this section
  let depth = 0;
  let i = mb8Start;
  let foundStart = false;
  while (i < content.length) {
    if (content.substring(i, i + 4) === '<div') {
      depth++;
      foundStart = true;
    }
    if (content.substring(i, i + 6) === '</div>') {
      depth--;
      if (foundStart && depth === 0) {
        // Found the end
        const sectionEnd = i + 6;
        const newSection = `{/* Upcoming Events - MMA Fight Cards */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white pl-2">Upcoming</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50">Events ordered by: <span className="font-semibold text-white">Popularity</span></span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/5 border border-white/20 rounded-small cursor-pointer transition-colors duration-300"
                    >
                      <IconFilter className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    sideOffset={5}
                    className="w-[180px] bg-[#2d2d2d] border-white/10 z-[120]"
                    style={{ zIndex: 120 }}
                  >
                    {eventOrderOptions.map((option) => (
                      <DropdownMenuItem 
                        key={option.value}
                        onClick={() => setEventOrderBy(option.value)}
                        className={cn(
                          "text-white/70 hover:text-white hover:bg-white/5 cursor-pointer",
                          eventOrderBy === option.value && "bg-white/10 text-white"
                        )}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className={cn("grid gap-3", isMobile ? "grid-cols-1" : "grid-cols-2")}>
              {filteredUpcomingEvents.map((event) => {
                const moneylineMarket = event.markets.find((m: any) => m.title === 'Moneyline')
                const fighter1Odds = moneylineMarket?.options?.[0]
                const fighter2Odds = moneylineMarket?.options?.[1]
                
                return (
                  <div key={event.id} className="bg-white/5 border border-white/10 rounded-small p-3 hover:bg-white/[0.07] transition-colors cursor-pointer">
                    {/* Card Header - League & Time */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <IconTrophy className="w-3 h-3 text-white/50" />
                        <span className="text-[10px] text-white/70 font-medium">{event.league}</span>
                        <span className="text-[10px] text-white/40">|</span>
                        <span className="text-[10px] text-white/50">{event.country}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5 bg-amber-500/20 border border-amber-500/40 rounded px-1.5 py-0.5">
                          <span className="text-[9px] font-semibold text-amber-400">UPCOMING</span>
                        </div>
                        <span className="text-[10px] text-white/50 font-medium">{event.time}</span>
                      </div>
                    </div>
                    
                    {/* Fighter 1 Row */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-[12px] font-semibold text-white truncate">{event.team1}</span>
                      </div>
                      {fighter1Odds && (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            addBetToSlip(event.id, \`\${event.team1} v \${event.team2}\`, 'Moneyline', fighter1Odds.label, fighter1Odds.odds)
                          }}
                          className={cn(
                            "ml-3 rounded-small w-[72px] h-[36px] flex flex-col items-center justify-center transition-colors cursor-pointer flex-shrink-0",
                            isBetSelected(event.id, 'Moneyline', fighter1Odds.label)
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "bg-white/10 hover:bg-white/20 text-white"
                          )}
                          onMouseEnter={(e) => {
                            if (!isBetSelected(event.id, 'Moneyline', fighter1Odds.label)) {
                              e.currentTarget.style.backgroundColor = brandPrimary
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isBetSelected(event.id, 'Moneyline', fighter1Odds.label)) {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                            }
                          }}
                        >
                          <div className="text-[10px] text-white/60 leading-none mb-0.5">{fighter1Odds.label}</div>
                          <div className="text-xs font-bold leading-none">{fighter1Odds.odds}</div>
                        </button>
                      )}
                      <IconChevronRight className="w-3.5 h-3.5 text-white/30 ml-2 flex-shrink-0" />
                    </div>
                    
                    {/* Fighter 2 Row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-[12px] font-semibold text-white truncate">{event.team2}</span>
                      </div>
                      {fighter2Odds && (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            addBetToSlip(event.id, \`\${event.team1} v \${event.team2}\`, 'Moneyline', fighter2Odds.label, fighter2Odds.odds)
                          }}
                          className={cn(
                            "ml-3 rounded-small w-[72px] h-[36px] flex flex-col items-center justify-center transition-colors cursor-pointer flex-shrink-0",
                            isBetSelected(event.id, 'Moneyline', fighter2Odds.label)
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "bg-white/10 hover:bg-white/20 text-white"
                          )}
                          onMouseEnter={(e) => {
                            if (!isBetSelected(event.id, 'Moneyline', fighter2Odds.label)) {
                              e.currentTarget.style.backgroundColor = brandPrimary
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isBetSelected(event.id, 'Moneyline', fighter2Odds.label)) {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                            }
                          }}
                        >
                          <div className="text-[10px] text-white/60 leading-none mb-0.5">{fighter2Odds.label}</div>
                          <div className="text-xs font-bold leading-none">{fighter2Odds.odds}</div>
                        </button>
                      )}
                      <div className="w-3.5 ml-2 flex-shrink-0" />
                    </div>
                    
                    {/* Moneyline Label */}
                    <div className="text-[10px] text-white/40 text-center border-t border-white/5 pt-2">Moneyline</div>
                  </div>
                )
              })}
            </div>
          </div>`;
        
        content = content.substring(0, lineStart) + '          ' + newSection + '\n          \n' + content.substring(sectionEnd);
        break;
      }
    }
    i++;
  }
  
  return content;
}

// Process each file
for (const file of files) {
  const fullPath = path.join(process.cwd(), file);
  if (!fs.existsSync(fullPath)) {
    console.log(`SKIP: ${file} (not found)`);
    continue;
  }
  
  let content = fs.readFileSync(fullPath, 'utf-8');
  const original = content;
  
  // Step 1: Remove the old live block marker if present (from partial edits on mma/page.tsx)
  content = removeOldLiveBlock(content);
  
  // Step 2: Strip non-moneyline markets from event data
  content = stripNonMoneylineMarkets(content);
  
  // Step 3: Replace Live Events section
  content = replaceLiveEventsSection(content);
  
  // Step 4: Replace Upcoming Events section
  content = replaceUpcomingEventsSection(content);
  
  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`UPDATED: ${file}`);
  } else {
    console.log(`NO CHANGES: ${file}`);
  }
}

console.log('Done!');
